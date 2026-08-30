<?php

namespace App\Services;

use App\Models\Consultation;
use App\Models\Lead;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AriaVoiceAgentService
{
    const GREETING_EN = "Hello! Thank you for calling Verse Next. My name is Aria, your AI assistant. How can I assist you today?";
    const GREETING_UR = "Assalam-o-Alaikum! Verse Next me call karne ka shukriya. Mera naam Aria hai. Main aaj aapki kis tarah madad kar sakti hoon?";

    protected array $fallbackModels = [
        'gemini-3.6-flash',
        'gemini-3.7-flash',
        'gemini-flash-latest',
        'gemini-2.5-flash-lite',
        'gemini-pro-latest',
    ];

    public function generateReply(string $userMessage, array $conversationHistory = []): array
    {
        $apiKey = config('services.gemini.key');
        $configuredModel = config('services.gemini.model', 'gemini-3.6-flash');

        $modelsToTry = array_unique(array_merge([$configuredModel], $this->fallbackModels));

        $cleanUserMessage = trim($userMessage);
        if ($cleanUserMessage === '') {
            $fallbackReply = "I am listening. How can I help you with your project?";
            return [
                'reply' => $fallbackReply,
                'audio_url' => $this->generateHumanAudio($fallbackReply),
                'lead_extracted' => null,
            ];
        }

        $systemPrompt = $this->buildSystemPrompt();
        $formattedContents = $this->buildGeminiContents($conversationHistory, $cleanUserMessage);

        foreach ($modelsToTry as $model) {
            $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent";

            try {
                $response = Http::timeout((int) config('services.gemini.timeout', 12))
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
                            'topP' => 0.9,
                            'maxOutputTokens' => 800,
                        ],
                    ]);

                if ($response->successful()) {
                    $rawText = data_get($response->json(), 'candidates.0.content.parts.0.text', '');
                    $cleanReply = $this->cleanVoiceReply($rawText);

                    if ($cleanReply !== '') {
                        $leadData = $this->extractLeadDetails($cleanUserMessage, $conversationHistory);
                        $audioUrl = $this->generateHumanAudio($cleanReply);

                        return [
                            'reply' => $cleanReply,
                            'audio_url' => $audioUrl,
                            'lead_extracted' => $leadData,
                        ];
                    }
                } else {
                    Log::warning("Aria Voice Agent model {$model} failed.", [
                        'status' => $response->status(),
                        'body' => Str::limit($response->body(), 200),
                    ]);
                }
            } catch (\Throwable $exception) {
                Log::warning("Aria Voice Agent exception on model {$model}: " . $exception->getMessage());
            }
        }

        // Contextual dynamic fallback if all API calls failed
        $isUrdu = (bool) preg_match('/(?:kya|kaise|mujhe|aap|hum|chahiye|haan|nahi|karein|batao|shukriya|meeting|waqt)/i', $cleanUserMessage);
        $leadData = $this->extractLeadDetails($cleanUserMessage, $conversationHistory);

        if ($leadData && (!empty($leadData['email']) || !empty($leadData['phone']))) {
            $reply = $isUrdu 
                ? "Shukriya! Maine aapki details note kar li hain. Hamari team jald aapko discovery meeting ka invite bhej degi." 
                : "Thank you! I have noted your contact details and our technical team will send your meeting invite shortly.";
        } elseif (preg_match('/(?:meeting|schedule|appointment|book|demo|call)/i', $cleanUserMessage)) {
            $reply = $isUrdu
                ? "Zaroor! Main technical team ke sath aapki discovery call schedule kar sakti hoon. Aap ke liye kaunsa din aur waqt behtar rahega?"
                : "Certainly! I can schedule a discovery call with our technical team. What day and time works best for you?";
        } elseif (preg_match('/(?:service|services|kya karte|offer|develop|website|ai|calling|app)/i', $cleanUserMessage)) {
            $reply = $isUrdu
                ? "Hum custom AI voice agents, full-stack websites, SaaS portals, mobile apps aur business automation provide karte hain. Aap ko kis service ke baare mein jan-na hai?"
                : "We provide custom AI voice calling agents, web development, mobile apps, SaaS platforms, and workflow automation. Which service are you interested in?";
        } else {
            $reply = $isUrdu
                ? "Ji bilkul, main aapki poori madad kar sakti hoon. Aap apne project ke bare mein thoda aur batayein ge?"
                : "I can certainly help you with that. Could you share a bit more about your project requirements?";
        }

        return [
            'reply' => $reply,
            'audio_url' => $this->generateHumanAudio($reply),
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

                $response = Http::timeout(10)
                    ->withHeaders([
                        'Content-Type' => 'application/json',
                        'x-goog-api-key' => $apiKey,
                    ])
                    ->post($endpoint, [
                        'contents' => [
                            [
                                'role' => 'user',
                                'parts' => [
                                    ['text' => "Read warmly and naturally like a human receptionist: " . $text]
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
            pack('V', 16) . // Subchunk1Size
            pack('v', 1) .  // AudioFormat (PCM)
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
You are "Aria", a highly capable, intelligent, and natural human receptionist and business development consultant for "Verse Next" (an AI & Tech Solutions Agency, versenext.com).
You are currently on a LIVE VOICE CALL with a client/caller.

# CRITICAL VOICE CONVERSATION RULES:
1. ALWAYS DIRECTLY ANSWER THE CALLER'S EXACT QUESTION OR REQUEST:
   - If they ask about services: Explain what Verse Next builds (AI voice calling agents, full-stack web development, SaaS portals, mobile apps, clinic/business appointment automation, SEO).
   - If they want to schedule a meeting: Ask for their preferred day and time.
   - If they provide day/time: Acknowledge it and ask for their name and email/WhatsApp.
   - If they give contact info: Confirm that the discovery meeting is booked.
   - If they ask about pricing: Politely explain that pricing is customized to the scope, and the team will provide a tailored quote and live demo on a quick call.
   - If they ask if you are an AI: Answer naturally that you are Verse Next's AI voice agent demonstrating how 24/7 calling automation works.
2. DO NOT REPEAT BOILERPLATE GREETINGS:
   - NEVER start your answers with "Thank you for calling Verse Next" or repetitive script intros on ongoing turns. The greeting was already done when the call connected.
   - Jump straight into replying to what the caller just said like a real human.
3. LANGUAGE MATCHING:
   - If the caller speaks in Roman Urdu / Urdu, reply in natural, fluent, polite Roman Urdu.
   - If the caller speaks in English, reply in fluent, professional English.
4. SPOKEN CONCISENESS (VERY IMPORTANT):
   - Keep answers between 1 to 3 short sentences. Callers want quick, natural conversational responses.
   - NEVER output bullet points, asterisks, quotation marks, hashtags, numbers lists, or markdown symbols. Output ONLY clean spoken plain text.
PROMPT;
    }

    private function buildGeminiContents(array $history, string $newMessage): array
    {
        $contents = [];

        // Append recent conversation turns (up to last 10 messages)
        $recentHistory = array_slice($history, -10);
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

        // Append the latest user message
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

        // Remove markdown asterisks, hashes, backticks, bullet points, brackets, quotes
        $clean = preg_replace('/[\*#_`~>\[\]\(\)\"\'\–\—]+/', '', $reply);
        // Clean multiple spaces and newlines
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
