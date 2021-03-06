<?php

namespace Modules\Api\GraphQL\Type;

use Illuminate\Support\Facades\DB;
use Spatie\MediaLibrary\Models\Media;

class MediaType
{
    /**
     * @param Media $rootValue
     * @return string
     */
    public function getThumbUrl(Media $rootValue): string
    {
        return $rootValue->getFullUrl('thumb');
    }

    /**
     * @param Media $rootValue
     * @return string
     */
    public function getThumbBlurUrl(Media $rootValue): string
    {
//        return $rootValue->getFullUrl('thumb_blur');
        return $rootValue->getFullUrl('thumb');
    }

    /**
     * @param Media $rootValue
     * @return string
     */
    public function getBigThumbUrl(Media $rootValue): string
    {
        return $rootValue->getFullUrl('big_thumb');
    }

    /**
     * @param Media $rootValue
     * @return string
     */
    public function getBigThumbBlurUrl(Media $rootValue): string
    {
//        return $rootValue->getFullUrl('big_thumb_blur');
        return $rootValue->getFullUrl('big_thumb');
    }

    /**
     * @param Media $rootValue
     * @return string
     */
    public function getUrl(Media $rootValue): string
    {
        return $rootValue->getFullUrl();
    }

    /**
     * @param Media $rootValue
     * @return string
     */
    public function getBlurUrl(Media $rootValue): string
    {
//        return $rootValue->getFullUrl('blur');
        return $rootValue->getFullUrl();
    }

    /**
     * @param Media $rootValue
     * @return string
     */
    public function getMimeType(Media $rootValue): string
    {
        return $rootValue->mime_type;
    }

    /**
     * @param Media $rootValue
     * @return string
     */
    public function getCustomProperties(Media $rootValue): string
    {
        return json_encode($rootValue->custom_properties);
    }

    /**
     * @param Media $rootValue
     * @return string
     */
    public function getModelType(Media $rootValue): string
    {
        return $rootValue->model_type;
    }

    /**
     * @param Media $rootValue
     * @return int
     */
    public function getModelId(Media $rootValue): int
    {
        return (int) $rootValue->model_id;
    }

    /**
     * @param Media $rootValue
     * @return int
     */
    public function getCollectionName(Media $rootValue): string
    {
        return $rootValue->collection_name;
    }

    /**
     * @param Media $rootValue
     * @return mixed
     */
    public function getCreatedAtDateTime(Media $rootValue)
    {
        return DB::table('media')
            ->find($rootValue->id)->created_at;
    }
}
