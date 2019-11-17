<?php

use Laravel\Lumen\Testing\DatabaseTransactions;

class AdminTest extends TestCase
{

    use DatabaseTransactions;


    /*
     * Admin has perrmision to block comments
     */

    /** @test */
    public function blockComment()
    {

        $unrelatedUser = factory(App\User::class, 1)->make()->first();
        $admin = factory(App\User::class, 'admin', 1)->create()->first();
        $event = factory(App\Event::class, 1)->create()->first();
        $comment = factory(App\Comment::class, 1)->create([
            'event_id' => $event->id
        ])->first();


        $this->actingAs($unrelatedUser)->put('/admin/blockComment/' . $comment->id, [
            'reason' => "Some reason"
        ]);
        $this->assertResponseStatus(401);


        $this->actingAs($admin)->put('/admin/blockComment/' . $comment->id, [
            'reason' => "Some reason"
        ]);
        $this->assertResponseStatus(200);

    }

}
