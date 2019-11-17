<?php

namespace App\Policies;

use App\User;
use App\Event;

class EventPolicy
{
    public function update(User $user, Event $event)
    {
        return (($user->id === $event->author_id)
                || $user->isAdmin()
        );
    }

    public function getDetails(User $user, Event $event)
    {
        return ( ($user->id === $event->author_id)
                || $user->isAdmin()
                || $event->isParticipant($user->id)
        );
    }

    public function delete(User $user, Event $event)
    {
        return (($user->id === $event->author_id)
        );
    }

    public function deleteByAdmin(User $user, Event $event)
    {
        return ( $user->isAdmin()
        );
    }

}