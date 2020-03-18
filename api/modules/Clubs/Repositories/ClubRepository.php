<?php declare(strict_types=1);

namespace Modules\Users\Repositories;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Modules\Clubs\Entities\Club;
use Modules\Common\Contracts\HasMediable;
use Modules\Common\Entities\ClubScheduleWork;
use Modules\Common\Traits\Mediable;
use Modules\Users\Entities\User;
use Modules\Users\Entities\Role;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ClubRepository implements HasMediable
{
    use Mediable;

    /**
     * @param User $user
     * @param Collection $collection
     * @return \Illuminate\Database\Eloquent\Model
     * @throws \Spatie\MediaLibrary\Exceptions\FileCannotBeAdded\DiskDoesNotExist
     * @throws \Spatie\MediaLibrary\Exceptions\FileCannotBeAdded\FileDoesNotExist
     * @throws \Spatie\MediaLibrary\Exceptions\FileCannotBeAdded\FileIsTooBig
     */
    public function store(User $user, Collection $collection): \Illuminate\Database\Eloquent\Model
    {
        $inputs = $collection->toArray();

        $inputs['phones'] = json_encode([
            $inputs['phone'],
        ]);

        DB::beginTransaction();

        /** @var Club $club */
        $club = $user->clubs()->create($inputs);

        if (!$club) {
            return NotFoundHttpException::class();
        }

        if ($user->hasRole(User::ACCOUNT_MANAGER)) {
            $club->manager_id = $user->id;
        }

        $moderator = $this->createModerator($collection);
        $club->admin()->associate($moderator);
        $club->save();

        if ($file = $collection->get('logotype')) {
            $club->addMedia($file)->toMediaCollection(Club::LOGO_COLLECTION);
        }

        DB::commit();

        return $club;
    }

    /**
     * @param Club $club
     * @param Collection $collection
     * @return bool
     * @throws \Spatie\MediaLibrary\Exceptions\FileCannotBeAdded\DiskDoesNotExist
     * @throws \Spatie\MediaLibrary\Exceptions\FileCannotBeAdded\FileDoesNotExist
     * @throws \Spatie\MediaLibrary\Exceptions\FileCannotBeAdded\FileIsTooBig
     */
    public function update(Club $club, Collection $collection): bool
    {
        DB::beginTransaction();

        $result = $club->update($collection->toArray());

        if ($logo = $collection->get('logotype')) {
            $club->addMedia($logo)->toMediaCollection(Club::LOGO_COLLECTION);
        }

        DB::commit();

        return $result;
    }

    /**
     * @param Collection $collection
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function storeSchedule(Collection $collection): \Illuminate\Database\Eloquent\Model
    {
        return ClubScheduleWork::create($collection->toArray());
    }

    /**
     * @param Collection $collection
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function updateSchedule(Collection $collection): \Illuminate\Database\Eloquent\Model
    {
        $schedule = $collection->toArray();

        return ClubScheduleWork::updateOrCreate([
            'day' => $schedule['day'],
            'club_id' => $schedule['club_id'],
        ], [
            'start' => $schedule['start'],
            'end' => $schedule['end'],
            'available' => $schedule['available'],
            'order' => $schedule['order'],
        ]);
    }

    public function createModerator(Collection $collection)
    {
        $data = $collection->get('moderator');
        $data['name'] = $data['first_name']." ".$data['last_name'];
        $data['password'] = bcrypt(\Str::random(6));
        $data['status'] = User::STATUS_AWAITING_CONFIRMATION;

        /** @var User $moderator */
        $moderator = User::create($data);
        $moderator->attachRole(Role::MODERATOR);

        return $moderator;
    }
}
