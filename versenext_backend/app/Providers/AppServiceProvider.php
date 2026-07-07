<?php

namespace App\Providers;
// AppServiceProvider.php
use App\Repositories\Admin\AdminInquiryRepositoryInterface;
use App\Repositories\Admin\AdminInquiryRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
           $this->app->bind(
        AdminInquiryRepositoryInterface::class,
        AdminInquiryRepository::class
    );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
