<?php

namespace App\Providers;

use App\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{

    public function register()
    {
        //
    }


    public function boot()
    {

        // EVENT POLICIES
        Gate::define('update-event', 'App\Policies\EventPolicy@update');
        Gate::define('delete-event', 'App\Policies\EventPolicy@delete');
        Gate::define('getDetails-event', 'App\Policies\EventPolicy@getDetails');
        Gate::define('deleteByAdmin-event', 'App\Policies\EventPolicy@deleteByAdmin');

        // INVITATION POLICIES
        Gate::define('respond-invitation', 'App\Policies\InvitationPolicy@respond');
        Gate::define('delete-invitation', 'App\Policies\InvitationPolicy@delete');
        Gate::define('getByUser-invitation', 'App\Policies\InvitationPolicy@getByUser');
        Gate::define('add-invitation', 'App\Policies\InvitationPolicy@add');

        //COMMENT POLICIES
        Gate::define('update-comment', 'App\Policies\CommentPolicy@update');
        Gate::define('delete-comment', 'App\Policies\CommentPolicy@delete');
        Gate::define('add-comment', 'App\Policies\CommentPolicy@add');

        // USER POLICIES
        Gate::define('modify-user', 'App\Policies\UserPolicy@modify');

        $this->app['auth']->viaRequest('api', function ($request) {
            if ($request->header('api_token'))
                return User::where('remember_token', $request->header('api_token'))->first();
        });
    }

}
