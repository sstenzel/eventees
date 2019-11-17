<?php

use App\Category;
use App\Event;
use App\Invitation;
use App\User;
use Carbon\Carbon;
use Faker\Factory;
use Faker\Generator as Faker;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/


$fakerPL =  Factory::create('pl_PL');

$factory->defineAs(App\User::class,  'admin',  function ($faker) use ($factory) {
    $user = $factory->raw('App\User');
    return array_merge($user, ['role_id' => 1]);
});


$factory->define(App\User::class, function (Faker $faker) use ($fakerPL){


    if ($faker->numberBetween(1,2) == 1) {
        $sex = "man";
        $firstName = $fakerPL->firstNameMale;
        $lastName = $fakerPL->lastNameMale;
    } else {
        $sex = "female";
        $firstName = $fakerPL->firstNameFemale;
        $lastName = $fakerPL->lastNameFemale;
    }

    if ($faker->numberBetween(1,2) == 1) {
        $login = mb_strtolower($firstName . $lastName);
    } else {
        $login = $fakerPL->unique()->userName;
    }

    return [
        'login' => $login,
        'email' => $fakerPL->unique()->safeEmail,
        'password' => Crypt::encrypt($faker->password),
        'first_name' => $firstName,
        'last_name' => $lastName,
        'sex' => $sex,
        'birth' => $faker->dateTimeBetween('-60 years', '-12 years')->format('Y-m-d'),
        'city' => $fakerPL->city,
        'description' => $faker->sentence(),
        'email_confirmed' => true,
        'role_id' => 2
    ];
});



$factory->define(App\Event::class, function (Faker $faker) use ($fakerPL){

    $category = Category::orderBy(DB::raw('RAND()'))->first();
    $slots = $faker->numberBetween(2,50);

    $adressDescription = ["Przy molo" ,"Boisko nr 2",
        "Trasa rowerowa w Parku Krajobrazowym",
        "Sala gimnastyczna szkoly podstawowej nr. 3" ,
           "Orlik" ,"Boisko miejskie" , "Boisko na Dużej Górce" ,
        "Stoly w parku" ,  "Szkola podstawowa" ,
        "Boisko koło zoo, wejście nr. 3" , "Boisko, za blokiem"
    ];

    $date = $faker->dateTimeBetween('-1 year', '+1 year')
        ->format('Y-m-d');
    return [
        'name' => $category->name,
        'description' => "",
        'date' => $date,
        'time' => $faker->time("H:i"),
        'slots_all' => $slots,
        'slots_available'
                => $faker->numberBetween(1,$slots),
        'author_id'
                => $faker->numberBetween(1, User::count()),
        'category_id' => $category->id,
        'latitude' => $faker->latitude(50,53),
        'longitude' =>  $faker->longitude(14,23),
        'adress_description' => $faker->randomElement($adressDescription),
        'created_at' =>
            $faker->dateTimeBetween(
            Carbon::createFromFormat('Y-m-d', $date)->subDays(20),
            $date)
            ->format('Y-m-d h:i:s')
    ];
});


$factory->define(App\Participation::class, function (Faker $faker) {

    do {
        $event = Event::orderBy(DB::raw('RAND()'))->first();

    } while ($event->slots_available <= 0);

    do {
        $userId = $faker->numberBetween(1, User::count());
        $invitation = Invitation::where('invited_user_id', $userId)->where('event_id', $event->id)->first();
    } while ($event->isParticipant($userId) || $invitation != null);

    $event->decrement('slots_available');
    $event->update();

    return [
            'event_id' => $event->id,
            'user_id' => $userId
        ];
});


$factory->define(App\Invitation::class, function (Faker $faker)  {

    do {
        $event = Event::orderBy(DB::raw('RAND()'))->first();

    } while ($event->slots_available <= 0);

    do {
        $userId = $faker->numberBetween(1, User::count());
        $invitation = Invitation::where('invited_user_id', $userId)->where('event_id', $event->id)->first();
    } while ($event->isParticipant($userId) || $invitation != null);


    return [
        'event_id' => $event->id,
        'invited_user_id' => $userId,
        'author_id' => $event->author->id
    ];
});


$factory->define(App\Comment::class, function (Faker $faker) {

    $comments = [
        'Bede na pewno!',
        'Już się nie mogę doczekać',
        'Mogę się spóźnić kilka minut',
        ':D',
        'Weźcie przeciwdeszczówkę',
        'Mogę zabrać psa?',
        'Mam piłkę',
        'Piąteczka!'
    ];

    do {
        $event = Event::orderBy(DB::raw('RAND()'))->first();

    } while ($event->participants->isEmpty());

    $user = $faker->randomElement($event->participants);

    $date = $faker->dateTimeBetween(
        $event->created_at,
        $event->date
        )
        ->format('Y-m-d h:i:s');

    return [
        'event_id' => $event->id,
        'user_id' => $user->id,
        'content' => $faker->randomElement($comments),
        'created_at' => $date
    ];
});
