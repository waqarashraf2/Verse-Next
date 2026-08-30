<?php

namespace App\Services;

use App\Models\Consultation;
use App\Models\Lead;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AriaVoiceAgentService
{
    const GREETING_EN = "Hey there! Thanks for calling Verse Next. I'm Aria. How can I help you today?";
    const GREETING_UR = "Assalam-o-Alaikum! Verse Next me call karne ka shukriya. Main Aria hoon. Aaj aapki kis project me madad kar sakti hoon?";

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
            $reply = "Hey! I'm listening. Tell me about your project or what you need.";
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
                            'temperature' => 0.6,
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
                Log::warning("Aria text generation failed on {$model}: " . $e->getMessage());
            }
        }

        // Smart dynamic fallback if Gemini API failed
        if ($cleanReply === '') {
            $isUrdu = (bool) preg_match('/(?:kya|kaise|mujhe|aap|hum|chahiye|batao|shukriya|meeting|waqt|services|kaam|urdu|baat|bolo|kar sakte)/i', $cleanUserMessage);
            
            if (preg_match('/(?:urdu|can you speak urdu|urdu me|urdu bolo|urdu aati hai)/i', $cleanUserMessage)) {
                $cleanReply = "Ji bilkul! Main Urdu me baat kar sakti hoon. Aap batayein main aaj aapki kya madad kar sakti hoon?";
            } elseif (preg_match('/(?:service|services|kya karte|offer|develop|website|ai|calling|app|software)/i', $cleanUserMessage)) {
                $cleanReply = $isUrdu
                    ? "Hum custom AI voice calling agents, full-stack websites, SaaS portals aur workflow automation build karte hain. Aap ko kis service ki detail chahiye?"
                    : "We build custom AI voice agents, full-stack websites, SaaS platforms, and workflow automations. Which solution would you like to explore?";
            } elseif (preg_match('/(?:meeting|schedule|appointment|book|demo|call)/i', $cleanUserMessage)) {
                $cleanReply = $isUrdu
                    ? "Zaroor! Main technical team ke sath 15-minute ki discovery meeting arrange kar deti hoon. Kaunsa din aur waqt best rahega?"
                    : "Awesome! I can book a 15-minute discovery call with our tech team. What day and time works best for you?";
            } elseif (preg_match('/(?:price|pricing|cost|kitne paise|kitna kharcha|budget)/i', $cleanUserMessage)) {
                $cleanReply = $isUrdu
                    ? "Pricing project ke scope aur features par depend karti hai. Hum discovery call par aapko live demo aur tailored quote provide kar denge."
                    : "Pricing depends on your specific scope and features. We'll give you a tailored quote and live demo on a quick discovery call.";
            } else {
                $cleanReply = $isUrdu
                    ? "Ji bilkul, main aapki poori help kar sakti hoon! Thoda aur batayein aapko kis tarah ka project develop karwana hai?"
                    : "I can definitely help with that! Could you tell me a little more about what you'd like to build?";
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

    public function generateHumanAudio(string $text, string $voice = 'Aoede'): ?string
    {
        $apiKey = config('services.gemini.key');
        $cleanText = trim($text);
        if ($cleanText === '') {
            return null;
        }

        // Layer 1: Gemini Studio TTS
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
                                        ['text' => "Speak loud, clear, fast, and natural like a friendly female receptionist: " . $cleanText]
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
                    Log::warning("Gemini TTS layer failed: " . $e->getMessage());
                }
            }
        }

        // Layer 2: High-Speed Neural Google TTS
        try {
            $isUrdu = (bool) preg_match('/(?:kya|kaise|mujhe|aap|hum|chahiye|batao|shukriya|zaroor|hain|hoon|ji|kar|saktee|sakta)/i', $cleanText);
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
            Log::warning("Fallback TTS failed: " . $e->getMessage());
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
# ROLE & PERSONALITY
You are "Aria", a smart, friendly, and natural human receptionist and business consultant for "Verse Next" (an AI & Tech Solutions Agency, versenext.com).
You are talking to a client on a live phone call.

# CRITICAL CONVERSATION RULES:
1. ALWAYS ANSWER THE USER'S EXACT QUESTION DIRECTLY AND INTELLIGENTLY:
   - If user asks "Can you speak in Urdu?" or speaks Urdu: Immediately answer in fluent, polite Roman Urdu ("Ji bilkul, main Urdu me baat kar sakti hoon!").
   - If user asks about services: Explain Verse Next's services (AI voice calling agents, web development, mobile apps, SaaS, business automation).
   - If user asks about meetings/calls: Offer a 15-minute discovery call and ask for their preferred day and time.
   - If user asks about prices: Explain that pricing is customized to project scope and we give free estimates on a call.
   - If user asks anything else: Answer it specifically and helpfully like an expert consultant.
2. NEVER REPEAT CANNED/BOILERPLATE GREETINGS:
   - Do NOT say "Thank you for calling Verse Next" during ongoing conversation turns.
   - Jump straight into answering the user's question.
3. LANGUAGE MATCHING:
   - If caller speaks Urdu or Roman Urdu, reply in natural, everyday conversational Roman Urdu.
   - If caller speaks English, reply in natural, fluent, friendly English.
4. BREVITY & CONCISENESS:
   - Keep answers between 1 to 2 short, crisp sentences.
   - NO markdown, NO asterisks, NO bullets, NO quotes. Output ONLY spoken conversational text.
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
            'name' => $name ?: 'Voice Caller (Aria)',
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
                'name' => $leadData['name'] ?? 'Voice Caller (Aria)',
                'email' => $leadData['email'] ?? 'voice-call@versnext.com',
                'phone' => $leadData['phone'] ?? null,
                'service' => $leadData['service'] ?? 'AI Voice Agent & Automation',
                'preferred_date' => now()->addDay()->toDateString(),
                'preferred_time' => $leadData['preferred_time'] ?? 'As discussed during call',
                'meeting_type' => 'voice_agent_discovery_call',
                'notes' => 'Booked via Aria AI Voice Receptionist. ' . $summaryNote,
            ]);

            Lead::create([
                'source' => 'aria_voice_agent',
                'name' => $consultation->name,
                'email' => $consultation->email,
                'phone' => $consultation->phone,
                'service' => $consultation->service,
                'timeline' => $consultation->preferred_date?->toDateString(),
                'notes' => $consultation->notes,
                'metadata' => [
                    'consultation_id' => $consultation->id,
                    'channel' => 'voice_call',
                    'agent' => 'Aria',
                ],
            ]);

            return $consultation;
        } catch (\Throwable $e) {
            Log::warning('Failed to save Aria voice consultation: ' . $e->getMessage());
            return null;
        }
    }
}
