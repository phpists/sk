<?php declare(strict_types=1);

namespace Modules\Events\Policies;

use Illuminate\Auth\Access\HandlesAuthorization;
use Modules\Events\Entities\Event;
use Modules\Users\Entities\Permission;
use Modules\Users\Entities\User;

class EventPolicy
{
    use HandlesAuthorization;

    public function view()
    {
        return true;
    }

    /**
     * @param User $user
     * @return bool
     */
    public function create(User $user): bool
    {
        if ($user->hasRole('admin')) {
            return false;
        }

        return $user->hasPermission(Permission::CREATE_EVENTS);
    }

    /**
     * @param User $user
     * @param Event $event
     * @return bool
     */
    public function update(User $user, Event $event): bool
    {
        if ($user->hasRole('admin')) {
            return false;
        }

        return ($user->events_club_owners->contains($event->id) || $user->owns($event, 'owner_id'))
            && $user->hasPermission(Permission::UPDATE_EVENTS);
    }

    /**
     * @param User $user
     * @param Event $event
     * @return bool
     */
    public function delete(User $user, Event $event): bool
    {
        if ($user->hasRole('admin')) {
            return false;
        }

        return ($user->events_club_owners->contains($event->id) || $user->owns($event, 'owner_id'))
            && $user->hasPermission(Permission::DELETE_EVENTS);
    }
}
