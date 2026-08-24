<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectInquiryResource;
use App\Models\ProjectInquiry;
use Illuminate\Http\Request;
use App\Mail\AdminInquiryMail;
use App\Mail\ClientInquiryConfirmationMail;
use App\Services\WhatsAppService;
use Illuminate\Support\Facades\Mail;


class ProjectInquiryController extends Controller
{
public function store(Request $request, WhatsAppService $whatsAppService)
{
    $validated = $request->validate([
        'full_name'       => 'required|string|max:255',
        'email'           => 'required|email|max:255',
        'phone'           => 'nullable|string|max:20',
        'company_name'    => 'nullable|string|max:255',
        'service_needed'  => 'required|string|max:255',
        'project_budget'  => 'nullable|string|max:100',
        'project_details' => 'required|string',
    ]);

    // 1. Save inquiry
    $inquiry = ProjectInquiry::create($validated);

    // 2. Send Emails
    try {
        Mail::to(['team@versenext.com', 'versanext@gmail.com'])
            ->queue(new AdminInquiryMail($inquiry));

        Mail::to($inquiry->email)
            ->queue(new ClientInquiryConfirmationMail($inquiry));
    } catch (\Throwable $e) {
        \Illuminate\Support\Facades\Log::error('Mail sending failed: ' . $e->getMessage());
    }

    // 3. Send WhatsApp notification to Admin (03365968297)
    $whatsAppService->sendInquiryAlert($inquiry);

    // 4. Return API response
    return response()->json([
        'status'  => true,
        'message' => 'Thank you for contacting VerseNext. We will get back to you shortly.',
        'data'    => new ProjectInquiryResource($inquiry),
    ], 201);
}
}
