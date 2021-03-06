<?php

namespace App\Nova;

use App\Nova\Actions\Confirm;
use App\Nova\Actions\Reject;
use App\Nova\Filters\ModerationStatusFilter;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class Verification extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var string
     */
    public static $model = 'Spatie\MediaLibrary\Models\Media';

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'name';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id',
    ];

    /**
     * @param Request $request
     *
     * @return bool
     */
    public static function availableForNavigation(Request $request): bool
    {
        return $request->user()->hasRole(\Modules\Users\Entities\User::ACCOUNT_ADMIN) ||
            $request->user()->hasRole(\Modules\Users\Entities\User::ACCOUNT_MODERATOR);
    }

    public static function indexQuery(NovaRequest $request, $query)
    {
        return $query->where('collection_name', 'like', '%verify-photo%');
    }

    /**
     * Get the fields displayed by the resource.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function fields(Request $request)
    {
        return [
            ID::make()->sortable(),

            BelongsTo::make('User', 'model', User::class),

            Text::make('Photo', function () {
                return view('nova.photo', ['photo' => $this])->render();
            })->asHtml(),

            Text::make('Status', function () {
                return view(
                    'nova.moderation_status',
                    ['status' => $this->status ?? 0]
                )->render();
            })->asHtml(),

            Text::make('Refuse reason', 'rejected_reason'),
        ];
    }

    /**
     * Get the cards available for the request.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function cards(Request $request)
    {
        return [];
    }

    /**
     * Get the filters available for the resource.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function filters(Request $request)
    {
        return [
            new ModerationStatusFilter(),
        ];
    }

    /**
     * Get the lenses available for the resource.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function lenses(Request $request)
    {
        return [];
    }

    /**
     * Get the actions available for the resource.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function actions(Request $request)
    {
        return [
            (new Confirm())->canRun(function ($request) {
                return true;
            }),
            (new Reject())->canRun(function ($request) {
                return true;
            }),
        ];
    }
}
