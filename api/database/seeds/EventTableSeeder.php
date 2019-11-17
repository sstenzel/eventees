<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;

class EventTableSeeder extends Seeder
{

    public function run()
    {
        $faker = \Faker\Factory::create();


        $places = [
             [54.413268,  18.624985, "Molo w Brzeźnie" ,
                 3, "2019-07-12","Siatkówka","Siatkówka"],
            [54.597911, 18.806674 , "Boisko nr 2 na Helu",
                3, "2019-04-15","Siatkówka","Siatkówka"],
            [  54.364130, 18.039417 ,  "Trasa rowerowa w Kaszubskim Parku Krajobrazowym",
                2, "2020-09-21","Kolarstwo","Kolarstwo"],
            [  52.400519, 16.885270 ,  "Sala gimnastyczna szkoly podstawowej nr. 3" ,
                4, "2019-10-15","Koszykówka","Koszykówka"],
            [  53.768288, 20.472790 ,  "Orlik" ,
                4, "2019-03-12","Koszykówka","Koszykówka"],
            [ 54.206361, 16.180260  ,  "Boisko miejskie" ,
                1, "2019-05-01","Piłka nożna","Piłka nożna"],
            [ 53.962421, 18.516196  ,  "Boisko na Dużej Górce" ,
                1, "2019-06-22","Piłka nożna","Piłka nożna"],
            [  53.973221, 17.926582 ,  "Stoly w parku" ,
                5, "2019-07-12","Tenis stołowy","Tenis stołowy"],
            [  52.442595, 16.982621 ,  "Szkola podstawowa im. Kowalskiego" ,
                4, "2020-01-15","Koszykówka","Koszykówka"],
            [  52.260469, 21.014114 ,  "Boisko koło zoo, wejście nr. 3" ,
                1, "2019-02-14","Piłka nożna","Piłka nożna"],
            [  51.845999, 15.603993 ,  "Boisko, za blokiem 29" ,
                1, "2019-03-19","Piłka nożna","Piłka nożna"]
        ];


        DB::table('event')
            ->insert([[
                'name' => "Siatkówka",
                'description' => "Siatkówka",
                'date' => Carbon::createFromDate(2019,07,12)->toDateString(),
                'time' => $faker-> time("H:i"),
                'slots_all' => 12,
                'slots_available' => 8,
                'author_id' => 2,
                'category_id' => 3,
                'latitude' => 54.597911,
                'longitude' => 18.806674,
                'adress_description' => "Boisko nr 2 na Helu",
                'created_at' => Carbon::createFromDate(2019,07,01)->toDateTimeString(),


            ], [
                'name' => "Siatkówka",
                'description' => "Siatkówka",
                'date' => Carbon::createFromDate(2019,07,14)->toDateString(),
                'time' => $faker-> time("H:i"),
                'slots_all' => 12,
                'slots_available' => 2,
                'author_id' => 3,
                'category_id' => 3,
                'latitude' => 54.597911,
                'longitude' => 18.806674,
                'adress_description' => "Boisko nr 2",
                'created_at' => Carbon::createFromDate(2019,07,02)->toDateTimeString(),

            ], [
                'name' => "Piłka nożna",
                'description' => "Piłka nożna",
                'date' => Carbon::createFromDate(2019,05,01)->toDateString(),

                'time' => $faker-> time("H:i"),
                'slots_all' => 5,
                'slots_available' => 2,
                'author_id' => 3,
                'category_id' => 1,
                'latitude' => 52.260469,
                'longitude' => 21.014114,
                'adress_description' => "Boisko koło zoo, wejście nr. 3",
                'created_at' => Carbon::createFromDate(2019,04,12)->toDateTimeString(),


            ]]);



        for($i=0; $i<=10; $i++):
            $slots = $faker->numberBetween(2,100);
            DB::table('event')
                ->insert([
                    'name' => $places[$i][5],
                    'description' => $places[$i][5],
                    'date' => date('Y-m-d',strtotime($places[$i][4])),
                    'time' => $faker-> time("H:i"),
                    'slots_all' => $slots,
                    'slots_available' => $faker->numberBetween(1,$slots),
                    'author_id' => 3,
                    'category_id' => $places[$i][3],
                    'latitude' => $places[$i][0],
                    'longitude' => $places[$i][1],
                    'adress_description' => $places[$i][2],
                    'created_at' => $faker->dateTimeBetween(
                        Carbon::createFromFormat('Y-m-d', date('Y-m-d', strtotime($places[$i][4])))->subDays(20),
                        date('Y-m-d',strtotime($places[$i][4])))
                        ->format('Y-m-d h:i:s')
                ]);
        endfor;

        for($i=0; $i<=100; $i++):
            factory(App\Event::class)->create();
        endfor;
    }
}




