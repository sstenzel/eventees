<?php

use Laravel\Lumen\Testing\DatabaseTransactions;

class EventTest extends TestCase
{

    use DatabaseTransactions;

    /* All events are visible for guests and users */

    /** @test */
    public function getAllEvents()
    {
        $this->get('/event/');
        $this->assertResponseStatus(200);
        $this->seeJsonStructure(
            [[
                "id",
                "name",
                "description",
                "created_at",
                "date",
                "time",
                "slots_available",
                "slots_all",
                "latitude",
                "longitude",
                "adress_description",
                "category_name",
                "category_description",
                "category_photo",
                "category_markup",
                "author"
            ]]
        );
       }


    /*
     * User can create event
     * Other user can add participation to that event
     * Participant and author can see details of event
     * Unrelated to the event user does not have access to details
     */

    /** @test */
    public function eventDetailsVisibility()
    {
        $unrelatedUser = factory(App\User::class, 1)->make()->first();
        $eventAuthor = factory(App\User::class, 1)->create()->first();
        $user = factory(App\User::class, 1)->create()->first();

        $this->actingAs($eventAuthor)->post('/event',
            [
                "name" => "Nazwa Eventu",
                "description" => "Dum dum dum",
                "date" => "2017-12-12",
                "time" => "11:30",
                "slots_available" => 130,
                "slots_all" => 150,
                "category_id" => 4,
                "latitude" => 80,
                "longitude" => 80,
                "adress_description" => "Opis miejsca"
            ]);

        $this->assertResponseStatus(200);
        $this->assertNotEmpty($eventAuthor->createdEvents);

        $event = $eventAuthor->createdEvents->first();

        $this->actingAs($user)->post('/participation',
            ['event_id' => $event->id]
        );
        $this->assertResponseStatus(200);
        $this->assertNotNull($user->participations->first());

        $participation = $user->participations->first();
        $this->assertEquals($event->id, $participation->id);

        $this->actingAs($user)->get('/event/allDetails/' . $event->id);
        $this->assertResponseStatus(200);

        $this->actingAs($eventAuthor)->get('/event/allDetails/' . $event->id);
        $this->assertResponseStatus(200);

        $this->actingAs($unrelatedUser)->get('/event/allDetails/' . $event->id);
        $this->assertResponseStatus(403);
    }

    /*
     * Inviting other user
     * Responding to invitation
     *
     */

    /** @test */
    public function invitations()
    {
        $eventAuthor = factory(App\User::class, 1)->create()->first();
        $event = factory(App\Event::class, 1)->create([
            'author_id' => $eventAuthor->id
        ])->first();
        $user = factory(App\User::class, 1)->create()->first();


        $this->actingAs($eventAuthor)->post('/invitation',
            [
                'event_id' => $event->id,
                'login' => $user->login
            ]
        );

        $this->assertResponseStatus(200);
        $this->assertNotNull($user->invitations()->where('event_id', $event->id)->first());


        $this->actingAs($user)->put('/invitation',
            [
                'event_id' => $event->id,
                'accepted' => true
            ]
        );

        $this->assertResponseStatus(200);
        $this->assertNull($user->invitations()->where('event_id', $event->id)->first());
        $this->assertEquals($event->id, $user->participations->first()->id);

    }

    /*
     * Participant or author can add comment to the event
     * Others are not allowed
     */

    /** @test */
    public function comments()
    {
        $komentarz1 = "Pierwszy przykładowy komentarz";
        $komentarz2 = "Drugi przykładowy komentarz";

        $unrelatedUser = factory(App\User::class, 1)->make()->first();
        $eventAuthor = factory(App\User::class, 1)->create()->first();
        $event = factory(App\Event::class, 1)->create([
            'author_id' => $eventAuthor->id
        ])->first();
        $user = factory(App\User::class, 1)->create()->first();
        $participation = factory(App\Participation::class, 1)->create([
            'event_id' => $event->id,
            'user_id' => $user->id
        ]);

        $this->actingAs($user)->post('/comment', [
            'event_id' => $event->id,
            'content' => $komentarz1
        ]);
        $this->assertResponseStatus(200);
        $this->assertEquals($komentarz1, $user->comments->first()->content);
        $this->assertEquals($event->id, $user->comments->first()->event_id);


        $this->actingAs($eventAuthor)->post('/comment', [
            'event_id' => $event->id,
            'content' => $komentarz2
        ]);
        $this->assertResponseStatus(200);
        $this->assertEquals($komentarz2, $eventAuthor->comments->first()->content);
        $this->assertEquals($event->id, $eventAuthor->comments->first()->event_id);

        $this->actingAs($unrelatedUser)->post('/comment', [
            'event_id' => $event->id,
            'content' => $komentarz1
        ]);
        $this->assertResponseStatus(403);

    }






}
