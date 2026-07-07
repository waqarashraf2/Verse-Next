<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectInquiryResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'            => $this->id,
            'full_name'     => $this->full_name,
            'email'         => $this->email,
            'phone'         => $this->phone,
            'company_name'  => $this->company_name,
            'service_needed'=> $this->service_needed,
            'project_budget'=> $this->project_budget,
            'project_details'=> $this->project_details,
            'status'        => $this->status,
            'ip_address'    => $this->ip_address,
            'created_at'    => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at'    => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
