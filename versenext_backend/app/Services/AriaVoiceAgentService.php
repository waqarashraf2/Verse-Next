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

    public function generateReply(string $userMessage, array $conversationHistory = []): array
    {
        $apiKey = config('services.gemini.key');
        $cleanUserMessage = trim($userMessage);

        if ($cleanUserMessage === '') {
            $reply = "Hey, I'm listening! Tell me about your project or what you're looking to build.";
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
                        'temperature' => 0.7,
                        'maxOutputTokens' => 90,
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
                    ? "Hum custom AI voice agents, modern websites aur business workflow automation build karte hain. Aap ko kis baare mein jan-na hai?"
                    : "We build custom AI voice calling agents, high-performance websites, and business automations. What type of solution are you looking for?";
            } elseif (preg_match('/(?:meeting|schedule|appointment|book|demo|call)/i', $cleanUserMessage)) {
                $cleanReply = $isUrdu
                    ? "Zaroor! Main technical team ke sath 15-minute ki quick call schedule kar sakti hoon. Kaunsa din aur time aapke liye best rahega?"
                    : "Awesome! I'd love to set up a quick 15-minute discovery call with our tech team. What day and time works best for you?";
            } else {
                $cleanReply = $isUrdu
                    ? "Ji bilkul! Main aapki poori help kar sakti hoon. Thoda sa aur batayein aapko kya build karwana hai?"
                    : "I can definitely help with that! Could you share a quick overview of what you need?";
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

        $ttsModels = ['gemini-2.5-flash-preview-tts', 'gemini-3.1-flash-tts-preview'];

        foreach ($ttsModels as $ttsModel) {
            try {
                $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$ttsModel}:generateContent";

                $response = Http::timeout(7)
                    ->withHeaders([
                        'Content-Type' => 'application/json',
                        'x-goog-api-key' => $apiKey,
                    ])
                    ->post($endpoint, [
                        'contents' => [
                            [
                                'role' => 'user',
                                'parts' => [
                                    ['text' => "Speak fast, lively, energetic, and completely natural like a real human girl on a phone call with zero robotic pauses: " . $text]
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
                Log::warning("TTS Generation failed on {$ttsModel}: " . $e->getMessage());
            }
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
# CHARACTER IDENTITY & VOICE
You are "Aria", a bright, energetic, and highly natural human receptionist at "Verse Next" (an AI & Tech Solutions Agency, versenext.com).
You are talking to a client on a live phone call.

# HUMAN CONVERSATIONAL STYLE:
1. TALK LIKE AN ENERGETIC REAL HUMAN:
   - Use natural conversational enthusiasm and expressions ("Sure thing!", "Awesome!", "I'd love to help!", "Zaroor!", "Ji bilkul!").
   - Speak briskly and confidently.
   - Never sound stiff, robotic, or like reading a manual.
2. CONCISE & FAST:
   - Keep answers to 1 or 2 quick, conversational sentences.
   - DO NOT repeat formal greetings or say "Thank you for calling Verse Next" after the initial greeting.
   - Never output markdown symbols, asterisks, bullets, or emojis.
3. LANGUAGE:
   - If the caller speaks Roman Urdu / Urdu, reply in natural, friendly, everyday modern Roman Urdu.
   - If the caller speaks English, reply in natural, fluent, friendly English.
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
