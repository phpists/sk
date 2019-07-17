<?php

namespace Modules\Users\Repositories;

use Modules\Users\Entities\User;

class UserRepository
{
    /**
     * @param array $args
     * @return array
     */
    public function register(array $args)
    {
        /** @var User $user */
        $user = User::create($args);
        $token = $user->createToken('Laravel Password Grant Client')->accessToken;

        $response = [
            'access_token' => $token,
            'user'         => $user
        ];

        return $response;
    }
}