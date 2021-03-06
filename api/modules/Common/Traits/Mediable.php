<?php declare(strict_types=1);

namespace Modules\Common\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Modules\Clubs\Entities\Club;
use Modules\Events\Entities\Event;
use Modules\Users\Entities\User;
use Spatie\MediaLibrary\Models\Media;

trait Mediable
{
    protected $diskName = 'media';

    /**
     * Save club attachments
     *
     * @param Model $model
     * @param $files
     * @param string $collection
     * @param array $customProperties
     */
    public function saveAttachments(Model $model, $files, $collection = 'photos', ?array $customProperties = [])
    {
        foreach ($files as $k => $file) {
            $this->saveFile($model, $file, $collection);
        }

        $customProperties = $customProperties ?? [];

        if (count($customProperties)) {
            $media = $model->getMedia($collection);

            /** @var Media $mediaItem */
            foreach ($media as $k => $mediaItem) {
                if ($customProperties[$k] ?? false) {
                    foreach ((array) $customProperties[$k] as $key => $value) {
                        $mediaItem->setCustomProperty($key, $value);
                        $mediaItem->save();
                    }
                }
            }
        }
    }

    /**
     * @param Model $model
     * @param UploadedFile $file
     * @param $collection
     * @return void
     * @throws \Spatie\MediaLibrary\Exceptions\FileCannotBeAdded\DiskDoesNotExist
     * @throws \Spatie\MediaLibrary\Exceptions\FileCannotBeAdded\FileDoesNotExist
     * @throws \Spatie\MediaLibrary\Exceptions\FileCannotBeAdded\FileIsTooBig
     */
    public function saveFile(Model $model, UploadedFile $file, $collection)
    {
        $fileName = $file->getClientOriginalName();
        $extension = Str::slug($file->getClientOriginalExtension());
        $storeName = md5($fileName . time()) . '.' . $extension;

        /** @var Club|User|Event $model */
        $model->addMedia($file)
            ->usingName($storeName)
            ->toMediaCollection($collection, $this->diskName);
    }

    /**
     * @param Model $model
     * @param $id
     * @return void
     * @throws \Spatie\MediaLibrary\Exceptions\MediaCannotBeDeleted
     */
    public function deleteFile(Model $model, $id)
    {
        /** @var Club|User|Event $model */
        $model->deleteMedia($id);
    }
}
