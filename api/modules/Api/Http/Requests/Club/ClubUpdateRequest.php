<?php

namespace Modules\Api\Http\Requests\Club;

use Illuminate\Foundation\Http\FormRequest;

class ClubUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name'         => 'required|string|max:255',
            'club_type_id' => 'bail|integer|exists:club_types,id',
            'email'        => 'email',
            'website'      => 'nullable|string|max:255',
            'phones'       => 'nullable',
            'phones.*'     => 'string',
            'description'  => 'string',
            'address'      => 'nullable|string|max:255',
            'lat'          => 'nullable|string',
            'lng'          => 'nullable|string',
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }
}