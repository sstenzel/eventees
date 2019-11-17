<?php

namespace App\Policies;

use App\Invitation;
use App\User;
use App\Event;

class InvitationPolicy
{

    public function add(User $user, Event $event)
    {
        return ( ($user->id === $event->author_id)
            || $user->isAdmin()
            || $event->isParticipant($user)
        );
    }

    public function respond(User $user, Invitation $invitation)
    {
        return ( ($user->id === $invitation->invitedUser->id)
        );
    }

    public function getByUser(User $user, Invitation $invitation)
    {
        return ( ($user->id === $invitation->invitedUser->id)
            || $user->isAdmin()
        );
    }
}