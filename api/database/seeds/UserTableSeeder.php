<?php

use Faker\Factory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class UserTableSeeder extends Seeder
{

    public function run()
    {

        $fakerPL =  Factory::create('pl_PL');

        DB::table('user')
            ->insert([
                    'login' => 'admin1',
                    'email' => 'admin@gmail.com',
                    'password' => Crypt::encrypt('admin123'),
                    'first_name' => 'Admin',
                    'last_name' => 'Adminowski',
                    'sex' => 'female',
                    'birth' => $fakerPL->dateTimeBetween('-60 years', '-12 years')->format('Y-m-d'),
                    'city' => $fakerPL->city,
                    'description' => 'Hej, jestem Adminem!',
                    'role_id' => 1,
                    'email_confirmed' => true

            ]);

        DB::table('user')
             ->insert([
                [
                    'login' => 'franek1',
                    'email' => 'franek@gmail.com',
                    'password' => Crypt::encrypt('franek123'),
                    'first_name' => 'Franek',
                    'last_name' =>  'Frankowski',
                    'sex' => 'male',
                    'birth' => $fakerPL->dateTimeBetween('-60 years', '-12 years')->format('Y-m-d'),
                    'city' => $fakerPL->city,
                    'description' => 'Jestem Franek, z zawodu księgowy z pasji tenisista.',
                    'email_confirmed' => true

                ],[
                    'login' => 'amelia1',
                    'email' => 'amelia@gmail.com',
                    'password' => Crypt::encrypt('amelia123'),
                    'first_name' => 'Amelia',
                    'last_name' => 'Ameliowska',
                    'sex' => 'female',
                    'birth' => $fakerPL->dateTimeBetween('-60 years', '-12 years')->format('Y-m-d'),
                    'city' => $fakerPL->city,
                    'description' => 'Zawodowo zajmuję się nauczaniem dzieci gry w tenisa',
                    'email_confirmed' => true

                 ]
            ]);

        for($i=0; $i<=40; $i++):
            factory(App\User::class)->create();
        endfor;
    }
}





