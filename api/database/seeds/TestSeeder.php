<?php

use Illuminate\Database\Seeder;

class TestSeeder extends Seeder
{

    public function run()
    {
        $this->call('RoleTableSeeder');
        $this->call('UserTableSeeder');
        $this->call('CategoryTableSeeder');
        $this->call('EventTableSeeder');
        $this->call('EventUserSeeder');
//        $this->call('CommentSeeder');
        $this->call('InvitationSeeder');
    }
}
