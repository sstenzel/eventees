<?php

namespace App\Policies;

use App\Comment;
use App\User;
use App\Event;


class CommentPolicy
{

    public function add(User $user, Event $event)
    {
        return ( ($user->id === $event->author_id)
            || $user->isAdmin()
            || $event->isParticipant($user->id)
        );
    }

    public function delete(User $user, Comment $comment)
    {
        return ( ($user->id === $comment->user_id)
            || $user->isAdmin()
        );
    }

    public function update(User $user, Comment $comment)
    {
        return ( ($user->id === $comment->user_id)
        );
    }

}