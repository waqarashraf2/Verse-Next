<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectInquiry extends Model
{
    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'company_name',
        'service_needed',
        'project_budget',
        'project_details',
        'read_at',
        'status',
    ];
}

