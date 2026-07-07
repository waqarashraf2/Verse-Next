<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Admin\AdminInquiryRepositoryInterface;
use App\Repositories\Admin\AdminInquiryRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(
            AdminInquiryRepositoryInterface::class,
            AdminInquiryRepository::class
        );
    }

    public function boot()
    {
        //
    }
}
