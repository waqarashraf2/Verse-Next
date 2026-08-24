<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected ?string $host;
    protected ?string $idInstance;
    protected ?string $apiToken;
    protected ?string $adminPhone;

    public function __construct()
    {
        $this->host = config('services.green_api.host', 'https://7107.api.greenapi.com');
        $this->idInstance = config('services.green_api.id_instance');
        $this->apiToken = config('services.green_api.api_token');
        $this->adminPhone = config('services.green_api.admin_phone', '923365968297');
    }

    /**
     * Send a text message via Green-API
     */
    public function sendMessage(string $message, ?string $to = null): bool
    {
        if (empty($this->idInstance) || empty($this->apiToken)) {
            Log::warning('Green-API credentials not configured in environment.');
            return false;
        }

        $phone = $to ?? $this->adminPhone;
        if (empty($phone)) {
            Log::warning('Admin WhatsApp number not configured.');
            return false;
        }

        // Clean phone number and ensure WhatsApp chatId format
        $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
        if (str_starts_with($cleanPhone, '0')) {
            $cleanPhone = '92' . substr($cleanPhone, 1);
        }
        $chatId = $cleanPhone . '@c.us';

        $url = rtrim($this->host, '/') . "/waInstance{$this->idInstance}/sendMessage/{$this->apiToken}";

        try {
            $response = Http::timeout(6)->post($url, [
                'chatId' => $chatId,
                'message' => $message,
            ]);

            if ($response->successful()) {
                Log::info("WhatsApp alert sent successfully to {$chatId}");
                return true;
            }

            Log::error('Failed to send WhatsApp alert via Green-API', [
                'status' => $response->status(),
                'response' => $response->json() ?? $response->body(),
            ]);
            return false;
        } catch (\Throwable $e) {
            Log::error('Green-API Exception: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Format and send new Project Inquiry notification
     */
    public function sendInquiryAlert($inquiry): bool
    {
        $name = $inquiry->full_name ?? 'N/A';
        $email = $inquiry->email ?? 'N/A';
        $phone = $inquiry->phone ?? 'N/A';
        $company = $inquiry->company_name ?? 'N/A';
        $service = $inquiry->service_needed ?? 'N/A';
        $budget = $inquiry->project_budget ?? 'N/A';
        $details = $inquiry->project_details ?? 'N/A';

        $message = "🚀 *New Contact Inquiry Received - Verse Next*\n\n"
            . "👤 *Name:* {$name}\n"
            . "📧 *Email:* {$email}\n"
            . "📱 *Phone:* {$phone}\n"
            . "🏢 *Company:* {$company}\n"
            . "🛠 *Service:* {$service}\n"
            . "💰 *Budget:* {$budget}\n\n"
            . "📝 *Project Details:*\n{$details}\n\n"
            . "⏰ *Received At:* " . now()->format('d M Y, h:i A');

        return $this->sendMessage($message);
    }
}
