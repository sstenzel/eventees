<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleTableSeeder extends Seeder
{

    public function run()
    {
        DB::table('role')
            ->insert([
                ['name' => "Admin"],
                ['name' => "User"]
            ]);
    }
}
