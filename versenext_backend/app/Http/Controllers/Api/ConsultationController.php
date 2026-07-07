<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use App\Models\Lead;
use Illuminate\Http\Request;

class ConsultationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'service' => 'nullable|string|max:255',
            'preferred_date' => 'nullable|date',
            'preferred_time' => 'nullable|string|max:50',
            'meeting_type' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        $consultation = Consultation::create([
            ...$validated,
            'meeting_type' => $validated['meeting_type'] ?? 'discovery_call',
        ]);

        Lead::create([
            'source' => 'consultation',
            'name' => $consultation->name,
            'email' => $consultation->email,
            'phone' => $consultation->phone,
            'service' => $consultation->service,
            'timeline' => $consultation->preferred_date?->toDateString(),
            'notes' => $consultation->notes,
            'metadata' => [
                'consultation_id' => $consultation->id,
                'preferred_time' => $consultation->preferred_time,
                'meeting_type' => $consultation->meeting_type,
            ],
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Consultation request received successfully.',
            'data' => $consultation,
        ], 201);
    }
}
