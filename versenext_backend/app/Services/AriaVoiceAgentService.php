<?php

namespace App\Services;

use App\Models\Consultation;
use App\Models\Lead;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AriaVoiceAgentService
{
    const AGENT_NAME = "Daniyal";
    const GREETING_EN = "Hey there! Thanks for calling Verse Next. This is Daniyal. How can I help you today?";
    const GREETING_UR = "Assalam-o-Alaikum! Verse Next se Daniyal baat kar raha hoon. Ji batayein, main aap ki kya madad kar sakta hoon?";

    protected array $fallbackModels = [
        'gemini-3.6-flash',
        'gemini-flash-latest',
        'gemini-pro-latest',
    ];

    public function generateReply(string $userMessage, array $conversationHistory = []): array
    {
        $apiKey = config('services.gemini.key');
        $cleanUserMessage = trim($userMessage);

        if ($cleanUserMessage === '') {
            $reply = "Ji batayein, main sun raha hoon. Aap apne business ya project ke baare mein kya discuss karna chahte hain?";
            return [
                'reply' => $reply,
                'audio_url' => $this->generateHumanAudio($reply),
                'lead_extracted' => null,
            ];
        }

        $systemPrompt = $this->buildSystemPrompt();
        $formattedContents = $this->buildGeminiContents($conversationHistory, $cleanUserMessage);

        $cleanReply = "";

        foreach ($this->fallbackModels as $model) {
            $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent";

            try {
                $response = Http::timeout(8)
                    ->withHeaders([
                        'Content-Type' => 'application/json',
                        'x-goog-api-key' => $apiKey,
                    ])
                    ->post($endpoint, [
                        'system_instruction' => [
                            'parts' => [
                                ['text' => $systemPrompt],
                            ],
                        ],
                        'contents' => $formattedContents,
                        'generationConfig' => [
                            'temperature' => 0.65,
                            'maxOutputTokens' => 250,
                        ],
                    ]);

                if ($response->successful()) {
                    $rawText = data_get($response->json(), 'candidates.0.content.parts.0.text', '');
                    $cleanReply = $this->cleanVoiceReply($rawText);
                    if ($cleanReply !== '') {
                        break;
                    }
                }
            } catch (\Throwable $e) {
                Log::warning("Daniyal text generation failed on {$model}: " . $e->getMessage());
            }
        }

        // Smart dynamic fallback if Gemini API fails
        if ($cleanReply === '') {
            $isUrdu = (bool) preg_match('/(?:kya|kaise|mujhe|aap|hum|chahiye|batao|shukriya|meeting|waqt|services|kaam|urdu|baat|bolo|kar sakte|clinic|agent)/i', $cleanUserMessage);

            if (preg_match('/(?:urdu|can you speak urdu|urdu me|urdu bolo|urdu aati)/i', $cleanUserMessage)) {
                $cleanReply = "Haan ji bilkul! Main Urdu me baat kar raha hoon. Aap batayein aapki kya requirement hai?";
            } elseif (preg_match('/(?:clinic|patient|doctor|hospital)/i', $cleanUserMessage)) {
                $cleanReply = $isUrdu
                    ? "Zabardast! Hum clinic ke liye aisa AI voice agent banate hain jo 24 ghante patient ki call receive karega, unki appointment book karega aur calendar me schedule kar dega. Aapke clinic me daily lag bhag kitni calls aati hain?"
                    : "Awesome! We build 24/7 AI receptionist agents for clinics that answer patient inquiries, book appointments, and sync directly with your calendar. Roughly how many calls do you receive daily?";
            } elseif (preg_match('/(?:service|services|kya karte|offer|develop|website|ai|calling|app|software|automation)/i', $cleanUserMessage)) {
                $cleanReply = $isUrdu
                    ? "Hum custom AI voice calling agents, CRM aur WhatsApp automation, aur full-stack web solutions build karte hain. Aap ko kis service ke baare mein detail chahiye?"
                    : "We build custom 24/7 AI calling agents, CRM & WhatsApp automations, and full-stack web platforms. Which solution are you interested in?";
            } elseif (preg_match('/(?:meeting|schedule|appointment|book|demo|call|zoom|meet)/i', $cleanUserMessage)) {
                $cleanReply = $isUrdu
                    ? "Is par detail me baat karne ke liye hum 10-15 minute ki quick demo call rakh lete hain. Aap kis din aur kis time free honge?"
                    : "To discuss this in detail, we can schedule a quick 10-15 minute Zoom discovery call. What day and time works best for you?";
            } elseif (preg_match('/(?:price|pricing|cost|kitne paise|kitna kharcha|budget|rate)/i', $cleanUserMessage)) {
                $cleanReply = $isUrdu
                    ? "Hamara pricing model business scale aur monthly calling minutes par depend karta hai. Hum 15 minute ki demo call me live system dikha kar exact quote share kar denge."
                    : "Our pricing depends on your calling volume and scope. On a quick 15-minute demo call, we will show you a live walkthrough and provide an exact tailored quote.";
            } else {
                $cleanReply = $isUrdu
                    ? "Ji bilkul theek hai, main samajh gaya. Iske baare mein thoda aur batayein taake main aapko best solution suggest kar sakoon?"
                    : "Got it, that makes sense! Could you share a bit more about your workflow so I can suggest the best approach?";
            }
        }

        $leadData = $this->extractLeadDetails($cleanUserMessage, $conversationHistory);
        $audioUrl = $this->generateHumanAudio($cleanReply);

        return [
            'reply' => $cleanReply,
            'audio_url' => $audioUrl,
            'lead_extracted' => $leadData,
        ];
    }

    public function generateHumanAudio(string $text, string $voice = 'Fenrir'): ?string
    {
        $apiKey = config('services.gemini.key');
        $cleanText = trim($text);
        if ($cleanText === '') {
            return null;
        }

        // Layer 1: Gemini Male Studio TTS (Fenrir / Puck)
        if ($apiKey) {
            $ttsModels = ['gemini-2.5-flash-preview-tts', 'gemini-3.1-flash-tts-preview'];
            foreach ($ttsModels as $ttsModel) {
                try {
                    $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$ttsModel}:generateContent";
                    $response = Http::timeout(6)
                        ->withHeaders([
                            'Content-Type' => 'application/json',
                            'x-goog-api-key' => $apiKey,
                        ])
                        ->post($endpoint, [
                            'contents' => [
                                [
                                    'role' => 'user',
                                    'parts' => [
                                        ['text' => "Speak loud, clear, calm, confident, and 100% natural like a male business consultant: " . $cleanText]
                                    ]
                                ]
                            ],
                            'generationConfig' => [
                                'responseModalities' => ['AUDIO'],
                                'speechConfig' => [
                                    'voiceConfig' => [
                                        'prebuiltVoiceConfig' => [
                                            'voiceName' => $voice
                                        ]
                                    ]
                                ]
                            ]
                        ]);

                    if ($response->successful()) {
                        $base64Pcm = data_get($response->json(), 'candidates.0.content.parts.0.inlineData.data');
                        if ($base64Pcm) {
                            $rawPcm = base64_decode($base64Pcm);
                            $wavAudio = $this->pcmToWav($rawPcm, 24000, 1, 16);
                            return 'data:audio/wav;base64,' . base64_encode($wavAudio);
                        }
                    }
                } catch (\Throwable $e) {
                    Log::warning("Gemini TTS male layer failed: " . $e->getMessage());
                }
            }
        }

        // Layer 2: Guaranteed Neural Google Audio Engine
        try {
            $isUrdu = (bool) preg_match('/(?:kya|kaise|mujhe|aap|hum|chahiye|batao|shukriya|zaroor|hain|hoon|ji|kar|sakta|theek|acha|samajh|khayal)/i', $cleanText);
            $lang = $isUrdu ? 'ur' : 'en';
            $encoded = urlencode($cleanText);
            $url = "https://translate.google.com/translate_tts?ie=UTF-8&tl={$lang}&client=tw-ob&q={$encoded}";

            $res = Http::timeout(4)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
                    'Referer' => 'http://translate.google.com/'
                ])
                ->get($url);

            if ($res->successful() && strlen($res->body()) > 300) {
                return 'data:audio/mp3;base64,' . base64_encode($res->body());
            }
        } catch (\Throwable $e) {
            Log::warning("Fallback male TTS failed: " . $e->getMessage());
        }

        return null;
    }

    private function pcmToWav(string $pcmData, int $sampleRate = 24000, int $channels = 1, int $bitsPerSample = 16): string
    {
        $dataLength = strlen($pcmData);
        $headerLength = 44;
        $totalLength = $dataLength + $headerLength - 8;
        $byteRate = $sampleRate * $channels * ($bitsPerSample / 8);
        $blockAlign = $channels * ($bitsPerSample / 8);

        $header = 'RIFF' .
            pack('V', $totalLength) .
            'WAVE' .
            'fmt ' .
            pack('V', 16) .
            pack('v', 1) .
            pack('v', $channels) .
            pack('V', $sampleRate) .
            pack('V', $byteRate) .
            pack('v', $blockAlign) .
            pack('v', $bitsPerSample) .
            'data' .
            pack('V', $dataLength);

        return $header . $pcmData;
    }

    private function buildSystemPrompt(): string
    {
        return <<<PROMPT
# IDENTITY & PERSONA
You are "Daniyal", a sharp, friendly, confident, and highly professional male AI consultant representing "Verse Next" (an AI & Tech Automation Agency, versenext.com).
You are having a real-time spoken voice phone call with a client.
Your voice must sound natural, calm, confident, warm, and 100% human.

# CRITICAL CONVERSATIONAL RULES (NO ROBOTIC / SCRIPTED BEHAVIOR):
1. NEVER USE SCRIPTED OR FIXED OPENINGS/CLOSINGS:
   - Do not sound like a pre-recorded IVR machine.
   - Do not repeat "Thank you for calling Verse Next" during ongoing conversation.
2. DYNAMIC & CONTEXTUAL:
   - Always listen carefully to the caller's specific question and answer THAT question directly.
   - If they ask in Urdu or ask "Can you speak in Urdu?", answer naturally in fluent Roman Urdu ("Haan ji bilkul!").
3. SPOKEN URDU NATURAL TONE:
   - Use natural, modern Pakistani spoken Urdu/Roman Urdu ("Haan ji bilkul", "Sahi hai", "Zabardast", "Main samajh gaya", "Aap bilkul fikar na karein", "Done ho gaya!").
   - NEVER use archaic, bookish words or stiff repetitive phrases.
4. ACTIVE LISTENING:
   - Use natural conversational acknowledgments like a real human ("Acha", "Right", "Got it", "Bilkul theek", "Zabardast").
5. CONCISE & CRISP:
   - Keep voice replies strictly between 1 to 2 short sentences.
   - Let the conversation feel like an interactive two-way chat.
   - NEVER use markdown asterisks, bullets, brackets, or emojis. Output spoken plain text only.

# KNOWLEDGE BASE - VERSE NEXT SERVICES:
- AI Calling & Receptionist Agents: For Clinics (patient booking), Real Estate, Customer Support, Agencies, and E-commerce.
- Custom Business Automations: Connecting calls to WhatsApp, CRM, Google Calendar, and SMS.
- 24/7 Availability: Never missing any customer lead or appointment.
- Meeting Scheduling: 15-minute quick discovery call / demo on Zoom or Google Meet. Collect Name, Email/WhatsApp, and preferred date/time.
PROMPT;
    }

    private function buildGeminiContents(array $history, string $newMessage): array
    {
        $contents = [];
        $recentHistory = array_slice($history, -6);
        foreach ($recentHistory as $turn) {
            $role = ($turn['role'] ?? '') === 'assistant' ? 'model' : 'user';
            $text = trim($turn['text'] ?? '');
            if ($text !== '') {
                $contents[] = [
                    'role' => $role,
                    'parts' => [['text' => $text]],
                ];
            }
        }

        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $newMessage]],
        ];

        return $contents;
    }

    public function cleanVoiceReply(?string $reply): string
    {
        if (!$reply) {
            return "";
        }
        $clean = preg_replace('/[\*#_`~>\[\]\(\)\"\'\–\—]+/', '', $reply);
        $clean = preg_replace('/\s+/', ' ', $clean);
        return trim($clean);
    }

    public function extractLeadDetails(string $latestMessage, array $history): ?array
    {
        $allUserText = '';
        foreach ($history as $turn) {
            if (($turn['role'] ?? '') === 'user') {
                $allUserText .= ' ' . ($turn['text'] ?? '');
            }
        }
        $allUserText .= ' ' . $latestMessage;

        $email = null;
        if (preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $allUserText, $matches)) {
            $email = strtolower($matches[0]);
        }

        $phone = null;
        if (preg_match('/(?:\+?\d{1,4}[\s-]?)?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,5}/', $allUserText, $matches)) {
            $cleaned = preg_replace('/[^\d+]/', '', $matches[0]);
            if (strlen($cleaned) >= 8) {
                $phone = $matches[0];
            }
        }

        $name = null;
        if (preg_match('/(?:my name is|name is|i am|mera naam hai|mera naam)\s+([A-Za-z\s\.\']{2,30})(?:,|\.|\s+and|\s+aur|$)/i', $allUserText, $matches)) {
            $name = trim($matches[1]);
        }

        $preferredTime = null;
        if (preg_match('/(?:tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday|kal|parso)\s*(?:at\s*)?(?:\d{1,2}(?::\d{2})?\s*(?:am|pm|baje)?)?/i', $allUserText, $matches)) {
            $preferredTime = trim($matches[0]);
        }

        if (!$email && !$phone) {
            return null;
        }

        return [
            'name' => $name ?: 'Voice Caller (Daniyal)',
            'email' => $email,
            'phone' => $phone,
            'preferred_time' => $preferredTime ?: 'As discussed on call',
            'raw_text' => $allUserText,
        ];
    }

    public function saveBookingIfPresent(array $leadData, string $summaryNote = ''): ?Consultation
    {
        if (empty($leadData['email']) && empty($leadData['phone'])) {
            return null;
        }

        try {
            $consultation = Consultation::create([
                'name' => $leadData['name'] ?? 'Voice Caller (Daniyal)',
                'email' => $leadData['email'] ?? 'voice-call@versnext.com',
                'phone' => $leadData['phone'] ?? null,
                'service' => $leadData['service'] ?? 'AI Calling Agent & Business Automation',
                'preferred_date' => now()->addDay()->toDateString(),
                'preferred_time' => $leadData['preferred_time'] ?? 'As discussed during call',
                'meeting_type' => 'voice_agent_discovery_call',
                'notes' => 'Booked via Daniyal AI Consultant. ' . $summaryNote,
            ]);

            Lead::create([
                'source' => 'daniyal_voice_agent',
                'name' => $consultation->name,
                'email' => $consultation->email,
                'phone' => $consultation->phone,
                'service' => $consultation->service,
                'timeline' => $consultation->preferred_date?->toDateString(),
                'notes' => $consultation->notes,
                'metadata' => [
                    'consultation_id' => $consultation->id,
                    'channel' => 'voice_call',
                    'agent' => 'Daniyal',
                ],
            ]);

            return $consultation;
        } catch (\Throwable $e) {
            Log::warning('Failed to save Daniyal voice consultation: ' . $e->getMessage());
            return null;
        }
    }
}
