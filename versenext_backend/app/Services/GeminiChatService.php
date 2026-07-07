<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class GeminiChatService
{
    public function generate(string $message, string $intent, string $service, string $localReply): ?string
    {
        $apiKey = config('services.gemini.key');
        $model = config('services.gemini.model', 'gemini-2.5-flash');

        if (!$apiKey || !$model) {
            return null;
        }

        $prompt = $this->buildPrompt($message, $intent, $service, $localReply);
        $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent";

        try {
            $response = Http::timeout((int) config('services.gemini.timeout', 12))
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'x-goog-api-key' => $apiKey,
                ])
                ->post($endpoint, [
                    'contents' => [
                        [
                            'role' => 'user',
                            'parts' => [
                                ['text' => $prompt],
                            ],
                        ],
                    ],
                    'generationConfig' => [
                        'temperature' => 0.45,
                        'topP' => 0.85,
                        'maxOutputTokens' => 280,
                    ],
                ]);

            if (!$response->successful()) {
                Log::warning('Gemini chatbot request failed.', [
                    'status' => $response->status(),
                    'model' => $model,
                ]);

                return null;
            }

            $text = data_get($response->json(), 'candidates.0.content.parts.0.text');

            return $this->cleanReply(is_string($text) ? $text : null);
        } catch (\Throwable $exception) {
            report($exception);

            return null;
        }
    }

    private function buildPrompt(string $message, string $intent, string $service, string $localReply): string
    {
        return <<<PROMPT
You are the professional website chatbot for Verse Next (versenext.com).
Company owner/CEO: Waqar Ashraf.

User message:
"{$message}"

Detected intent: {$intent}
Related service: {$service}
Local company answer to respect:
{$localReply}

Rules:
- Answer only about Verse Next services: websites, SaaS/software platforms, login/signup portals, admin dashboards, ecommerce, SEO, articles/blog structure, marketing, mobile apps, and AI automation.
- If the user writes Roman Urdu, reply mostly in clear Roman Urdu. If the user writes English, reply in English.
- Give a directly related answer to the user's exact question. Do not return generic filler.
- Do not discuss price, rate, package, quote, budget, or estimated cost.
- Do not ask for name, email, phone, WhatsApp, or personal details.
- Do not promise final delivery without a discovery meeting. Say that the team can discuss the roadmap in a meeting.
- Keep the answer professional, concise, helpful, and business-focused.
- Maximum 5 short sentences.
PROMPT;
    }

    private function cleanReply(?string $reply): ?string
    {
        if (!$reply) {
            return null;
        }

        $reply = trim(Str::of($reply)->replaceMatches('/\s+/', ' ')->toString());

        if ($reply === '') {
            return null;
        }

        $blocked = [
            'budget',
            'price',
            'pricing',
            'rate',
            'quote',
            'cost estimate',
            'email',
            'phone',
            'whatsapp',
        ];

        return Str::contains(Str::lower($reply), $blocked) ? null : $reply;
    }
}
