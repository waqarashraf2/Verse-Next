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
    const GREETING_EN = "Hey there! Thanks for calling Verse Next. This is Daniyal, your AI solutions consultant. How can I help you today?";

    protected array $fallbackModels = [
        'gemini-3.1-flash-lite',
        'gemini-3.5-flash-lite',
        'gemini-2.5-flash-lite',
        'gemini-3.6-flash',
        'gemini-flash-latest',
    ];

    public function generateReply(string $userMessage, array $conversationHistory = []): array
    {
        $apiKey = config('services.gemini.key');
        $cleanUserMessage = trim($userMessage);

        if ($cleanUserMessage === '') {
            $reply = "I'm listening. Tell me about your business or the automation project you'd like to discuss.";
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
                            'maxOutputTokens' => 200,
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

        // Context-aware dynamic fallback only in rare network downtime
        if ($cleanReply === '') {
            if (preg_match('/(?:clinic|patient|doctor|dental|hospital|appointment|receptionist)/i', $cleanUserMessage)) {
                $cleanReply = "We build custom 24/7 AI voice receptionists for clinics that answer patient inquiries, book appointments, and sync live with your calendar. How many calls does your clinic receive daily?";
            } elseif (preg_match('/(?:price|pricing|cost|quote|how much|rate|budget)/i', $cleanUserMessage)) {
                $cleanReply = "Our pricing is tailored to your business scale and monthly calling volume. In a quick 15-minute demo call, we can show you a live system and provide an exact quotation.";
            } elseif (preg_match('/(?:meeting|schedule|book|demo|call|zoom|calendar)/i', $cleanUserMessage)) {
                $cleanReply = "Let's schedule a 15-minute Zoom discovery call to map out your exact system requirements. What day and time works best for you?";
            } elseif (preg_match('/(?:service|services|what do you do|build|offer|develop|website|ai|agent|automation)/i', $cleanUserMessage)) {
                $cleanReply = "At Verse Next, we engineer custom AI voice calling agents, CRM and WhatsApp automations, and full-stack web platforms. Which area would you like to explore?";
            } else {
                $cleanReply = "I understand your requirement. To ensure we architect the exact solution you need, could you share a bit more detail about your current workflow?";
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

        // Layer 1: Gemini Male Studio Audio (Fenrir / Puck)
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
                                        ['text' => "Speak loud, confident, deep, and completely natural like a male AI business consultant: " . $cleanText]
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
                    Log::warning("Gemini male TTS failed: " . $e->getMessage());
                }
            }
        }

        // Layer 2: High-Definition Male English Audio
        try {
            $encoded = urlencode($cleanText);
            $url = "https://translate.google.com/translate_tts?ie=UTF-8&tl=en-US&client=tw-ob&q={$encoded}";

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
            Log::warning("Fallback English TTS failed: " . $e->getMessage());
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
You are "Daniyal", a sharp, articulate, confident, and highly intelligent male AI business and tech solutions consultant at "Verse Next" (an AI & Tech Solutions Agency, versenext.com).
You are speaking on a live, real-time voice call with a prospective client.
Your voice is deep, confident, energetic, polite, and 100% human.

# CRITICAL CONVERSATION INSTRUCTIONS:
1. STRICTLY ENGLISH ONLY:
   - Always converse in fluent, natural, professional English.
2. NO SCRIPTED OR CANNED RESPONSES:
   - NEVER repeat "Thank you for calling Verse Next" during ongoing conversation.
   - Actively analyze the caller's EXACT question and give a direct, consultative answer with high clarity.
   - If they describe a project (e.g. clinic booking, e-commerce automation, real estate agent, CRM pipeline), validate their idea, explain specifically how Verse Next solves it, and ask a relevant follow-up question.
3. CONVERSATIONAL BREVITY:
   - Speak in 1 to 2 crisp, impactful, natural sentences.
   - Never output bullet points, asterisks, quotation marks, or markdown symbols. Output pure spoken dialogue only.
4. ACTIONABLE CONSULTATION & DISCOVERY CALL BOOKING:
   - When the client is interested, smoothly offer a 15-minute live demo call on Zoom or Google Meet.
   - Ask for their preferred day/time and collect their Name and Email address or WhatsApp number to send the calendar invite.

# VERSE NEXT KNOWLEDGE BASE:
- Custom AI Voice Calling & Receptionist Agents: Automated Clinic/Dental Appointments, Real Estate Inbound/Outbound, Customer Support, Lead Qualification.
- Full Business Automations: Live CRM integration, WhatsApp notifications, Google Calendar sync, SMS alerts.
- Full-Stack Web & Software Engineering: Custom SaaS platforms, responsive web apps, automated dashboards.
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
        if (preg_match('/(?:my name is|name is|i am|this is)\s+([A-Za-z\s\.\']{2,30})(?:,|\.|\s+and|$)/i', $allUserText, $matches)) {
            $name = trim($matches[1]);
        }

        $preferredTime = null;
        if (preg_match('/(?:tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s*(?:at\s*)?(?:\d{1,2}(?::\d{2})?\s*(?:am|pm)?)?/i', $allUserText, $matches)) {
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
