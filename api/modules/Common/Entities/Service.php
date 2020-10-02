<?php

namespace Modules\Common\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Support\Str;
use Modules\Common\Entities\Traits\NameSlugable;
use Modules\Employees\Entities\Employee;
use Spatie\Translatable\HasTranslations;

class Service extends Model
{

    use SoftDeletes, NameSlugable, HasTranslations;

    public $timestamps = false;

    protected $appends = ['slug'];

    public $translatable = ['name'];

    public function employees()
    {
        return $this->morphToMany(Employee::class, 'serviceable')->withPivot('price');
    }

    /**
     * @return BelongsTo
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(GroupService::class,  'group_id');
    }

    public function getSlugAttribute(): string
    {
        return Str::slug($this->name);
    }
}
