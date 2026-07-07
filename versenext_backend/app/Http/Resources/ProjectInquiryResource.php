<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectInquiryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'full_name'       => $this->full_name,
            'email'           => $this->email,
            'phone'           => $this->phone,
            'company_name'    => $this->company_name,
            'service_needed'  => $this->service_needed,
            'project_budget'  => $this->project_budget,
            'project_details' => $this->project_details,
            'submitted_at'    => $this->created_at->toDateTimeString(),
        ];
    }
}

// docker-compose up -d
// docker-compose exec app bash