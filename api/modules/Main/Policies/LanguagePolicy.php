<?php

namespace Modules\Main\Policies;

use Illuminate\Auth\Access\HandlesAuthorization;
use Modules\Main\Entities\Language;
use Modules\Users\Entities\User;

class LanguagePolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * @param User $user
     * @return bool
     */
    public function create(User $user): bool
    {
        return $user->hasRole(User::ACCOUNT_ADMIN);
    }

    /**
     * @param User $user
     * @return bool
     */
    public function view(User $user): bool
    {
        return $user->hasRole(User::ACCOUNT_ADMIN);
    }

    /**
     * @param User $user
     * @return bool
     */
    public function update(User $user): bool
    {
        return $user->hasRole(User::ACCOUNT_ADMIN);
    }

    /**
     * @param User $user
     * @param Language $language
     * @return bool
     */
    public function delete(User $user, Language $language)
    {
        return  $user->hasRole(User::ACCOUNT_ADMIN) && $language->id !== 1;
    }

}
