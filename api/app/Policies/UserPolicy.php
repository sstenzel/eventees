<?php

namespace App\Policies;

use App\User;


class UserPolicy
{

    public function modify(User $user, User $userToModify)
    {
        return ( ($user->id === $userToModify->id)
            || $user->isAdmin()
        );
    }

}