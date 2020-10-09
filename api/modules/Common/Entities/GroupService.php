<?php

namespace Modules\Common\Entities;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

/**
 * Class GroupService
 * @package Modules\Common\Entities
 * @property int $id
 * @property string name
 */
class GroupService extends Model
{
    use HasTranslations;

    public $translatable = ['name'];

    public $timestamps = false;

    protected $fillable = [
        'id', 'name'
    ];

    public function services()
    {
        return $this->hasMany(Service::class,  'group_id');
    }
}
