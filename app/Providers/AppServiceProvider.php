<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\ServiceProvider;
use Laravel\Telescope\TelescopeServiceProvider;
use Modules\Main\Entities\Page;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        if ($this->app->isLocal()) {
            $this->app->register(TelescopeServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     * @throws \Exception
     */
    public function boot()
    {
        Relation::morphMap([
            'girl'           => 'Modules\Users\Entities\Girl',
            'user'           => 'Modules\Users\Entities\User',
            'club'           => 'Modules\Users\Entities\Club',
            Page::MORPH_TYPE => 'Modules\Main\Entities\Page',
        ]);
    }
}
