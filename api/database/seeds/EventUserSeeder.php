<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventUserSeeder extends Seeder
{

    public function run()
    {
        DB::table('event_user')
                ->insert([
                    'event_id' => 1,
                    'user_id' => 3
                ],[
                    'event_id' => 1,
                    'user_id' => 2
                ],[
                    'event_id' => 2,
                    'user_id' => 4
                ]);

        for($i=0; $i<=150; $i++):
            factory(App\Participation::class)->create();
        endfor;
        }
}
