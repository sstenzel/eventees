<?php

use Illuminate\Support\Facades\Crypt;
use Laravel\Lumen\Testing\DatabaseTransactions;


class UserTest extends TestCase
{

    use DatabaseTransactions;


    /* User can log in by email or login */

    /** @test */
    public function login()
    {

        $user = factory(App\User::class ,1)->create()->first();

        $this->post('/user/login', [
            'email' => $user->email,
            'password' => Crypt::decrypt($user->password)
        ]);
        $this->assertResponseStatus(200);
        $this->seeJsonStructure(
            [
                'status',
                'token'
            ]
        );

        $this->post('/user/login', [
            'login' => $user->login,
            'password' => Crypt::decrypt($user->password)
        ]);
        $this->assertResponseStatus(200);
        $this->seeJsonStructure(
            [
                'status',
                'token'
            ]
        );

    }




    /* Admin has access to all users, but common user not */

    /** @test */
    public function getAllUsers()
    {
        $user = factory('App\User',1)->make()->first();
        $this->actingAs($user)->get('/admin/allUsers/');

        $this->assertResponseStatus(401);


        $admin = factory(App\User::class, 'admin', 1)->make()->first();
        $this->actingAs($admin)->get('/admin/allUsers/');

        $this->assertResponseStatus(200);
        $this->seeJsonStructure(
            [[
                'id',
                'login',
                'email',
                'first_name',
                'last_name',
                'sex',
                'birth',
                'city',
                'avatar',
                'description',
                'email_confirmed',
                'blocked',
                'role_id'
            ]
            ]
        );
    }



}
