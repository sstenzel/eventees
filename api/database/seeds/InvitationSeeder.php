<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InvitationSeeder extends Seeder
{
    public function run()
    {
        DB::table('invitation')
            ->insert([
                [
                    'event_id' => 2,
                    'invited_user_id' => 2,
                    'author_id' => 3
                ],[
                    'event_id' => 3,
                    'invited_user_id' => 2,
                    'author_id' => 3
                ],[
                    'event_id' => 4,
                    'invited_user_id' => 2,
                    'author_id' => 3
                ],[
                    'event_id' => 5,
                    'invited_user_id' => 2,
                    'author_id' => 3
                ]
        ]);

        for($i=0; $i<=20; $i++):
            factory(App\Invitation::class)->create();
        endfor;
    }
}
