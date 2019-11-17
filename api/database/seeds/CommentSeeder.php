<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CommentSeeder extends Seeder
{
    public function run() {

         DB::table('comment')
                ->insert([[
                    'event_id' => 1,
                    'user_id' => 2,
                    'content' => 'Jedzie ktoś z Kościerzyny?',
                    'created_at' => date('Y-m-d h:i:s',strtotime("2019-07-10"))
                ],[
                    'event_id' => 1,
                    'user_id' => 3,
                    'content' => 'Mamy jedno miejsce, możesz sie zabrać',
                    'created_at' => date('Y-m-d h:i:s',strtotime("2019-07-11"))

                ],[
                    'event_id' => 2,
                    'user_id' => 4,
                    'content' => 'Troluje bo lubie! xD',
                    'created_at' => date('Y-m-d h:i:s',strtotime("2019-04-29"))

                ],[
                    'event_id' => 2,
                    'user_id' => 4,
                    'content' => 'Troluje bo lubie! xD',
                    'created_at' => date('Y-m-d h:i:s',strtotime("2019-04-29"))
                ],[
                    'event_id' => 2,
                    'user_id' => 4,
                    'content' => 'Troluje bo lubie! xD',
                    'created_at' => date('Y-m-d h:i:s',strtotime("2019-04-29"))
                ]]);

        for($i=0; $i<=40; $i++):
           factory(App\Comment::class)->create();
        endfor;
   }
}


