<?php

namespace App\Services;

use App\Models\Consultation;
use App\Models\Lead;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AriaVoiceAgentService
{
    const GREETING_EN = "Hello! Thank you for calling Verse Next. My name is Aria, your AI assistant. How can I help you today?";
    const GREETING_UR = "Assalam-o-Alaikum! Verse Next me call karne ka shukriya. Mera naam Aria hai. Main aapki kis tarah madad kar sakti hoon?";

    public function generateReply(string $userMessage, array $conversationHistory = []): array
    {
        $apiKey = config('services.gemini.key');
        $cleanUserMessage = trim($userMessage);

        if ($cleanUserMessage === '') {
            $reply = "I am listening. How can I help you with your project?";
            return [
                'reply' => $reply,
                'audio_url' => $this->generateHumanAudio($reply),
                'lead_extracted' => null,
            ];
        }

        $systemPrompt = $this->buildSystemPrompt();
        $formattedContents = $this->buildGeminiContents($conversationHistory, $cleanUserMessage);

        $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";
        $cleanReply = "";

        try {
            $response = Http::timeout(6)
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
                        'temperature' => 0.5,
                        'maxOutputTokens' => 100,
                    ],
                ]);

            if ($response->successful()) {
                $rawText = data_get($response->json(), 'candidates.0.content.parts.0.text', '');
                $cleanReply = $this->cleanVoiceReply($rawText);
            }
        } catch (\Throwable $e) {
            Log::warning("Aria text generation failed: " . $e->getMessage());
        }

        if ($cleanReply === '') {
            $isUrdu = (bool) preg_match('/(?:kya|kaise|mujhe|aap|hum|chahiye|batao|shukriya|meeting|waqt|services)/i', $cleanUserMessage);
            if (preg_match('/(?:service|services|kya karte|offer|develop|website|ai|calling|app)/i', $cleanUserMessage)) {
                $cleanReply = $isUrdu
                    ? "Hum custom AI voice agents, web development, SaaS portals aur workflow automation banate hain. Aap ko kis service ke baare mein jan-na hai?"
                    : "We build custom AI voice calling agents, web development, mobile apps, and business automations. What service are you looking for?";
            } elseif (preg_match('/(?:meeting|schedule|appointment|book|demo|call)/i', $cleanUserMessage)) {
                $cleanReply = $isUrdu
                    ? "Zaroor! Main technical team ke sath 15-minute ki discovery call schedule kar sakti hoon. Aap ke liye kaunsa din aur waqt behtar rahega?"
                    : "Certainly! I can schedule a 15-minute discovery call with our technical team. What day and time works best for you?";
            } else {
                $cleanReply = $isUrdu
                    ? "Ji bilkul, main aapki poori madad kar sakti hoon. Aap apne project ke bare mein batayein?"
                    : "I can certainly help you with that. Could you share a bit more about your project requirements?";
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
        if (!$apiKey || trim($text) === '') {
            return null;
        }

        try {
            $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent";

            $response = Http::timeout(8)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'x-goog-api-key' => $apiKey,
                ])
                ->post($endpoint, [
                    'contents' => [
                        [
                            'role' => 'user',
                            'parts' => [
                                ['text' => "Read naturally, warmly and fluently like a human receptionist with no pauses: " . $text]
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
            Log::warning("TTS Generation failed: " . $e->getMessage());
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
You are "Aria", an intelligent, polite, warm, and highly natural human receptionist for "Verse Next" (an AI & Tech Solutions Agency, versenext.com).
You are currently talking on a REAL LIVE PHONE CALL with a client.

# SPOKEN CONVERSATION RULES:
1. TALK LIKE A REAL LIVE HUMAN BEING:
   - Speak fluently, warmly, and directly.
   - If they ask what you do: Say you provide AI voice agents, web development, mobile apps, and business automation.
   - If they ask for meeting: Offer a 15-minute discovery call and ask for their preferred day/time.
   - If they give contact info: Confirm that the meeting invite will be sent.
2. NEVER REPEAT INTRODUCTORY GREETINGS:
   - Do NOT say "Thank you for calling Verse Next" again once the call has started.
   - Answer their specific question directly.
3. LANGUAGE MATCHING:
   - If user speaks in Roman Urdu / Urdu, reply in natural, everyday, fluent Roman Urdu.
   - If user speaks in English, reply in fluent, natural English.
4. BREVITY (ESSENTIAL):
   - Answer in 1 to 2 short, crisp sentences only.
   - NO markdown, NO asterisks, NO bullets, NO quotes. Output pure spoken dialogue only.
PROMPT;
    }

    private function buildGeminiContents(array $history, string $newMessage): array
    {
        $contents = [];
        $recentHistory = array_slice($history, -4);
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
