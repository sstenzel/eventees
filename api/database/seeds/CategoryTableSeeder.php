<?php

use Illuminate\Database\Seeder;

class CategoryTableSeeder extends Seeder
{

    public function run()
    {

            DB::table('category')
                ->insert([
                [
                    'name' => "Piłka nożna",
                    'description' => "Football",
                    'photo' => "football.jpg",
                    'markup' => "football.png"
                ],[
                    'name' => "Kolarstwo",
                    'description' => "Cycling",
                    'photo' => "cycling.jpg",
                    'markup' => "cycling.png"
                ],[
                    'name' => "Siatkówka",
                    'description' => "Volleyball",
                    'photo' => "volleyball.jpg",
                    'markup' => "volleyball.png"
                ],[
                    'name' => "Koszykówka",
                    'description' => "Basketball",
                    'photo' => "basketball.jpg",
                    'markup' => "basketball.png"
                ],[
                    'name' => "Tenis stołowy",
                    'description' => "Table tennis",
                    'photo' => "table-tennis.jpg",
                    'markup' => "table-tennis.png"
                ]]);
    }
}
