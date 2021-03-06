<?php

namespace Modules\Api\Http\Requests\Employee;

use \Modules\Api\Extensions\GraphQLFormRequest;

class EmployeeUpdateRequest extends GraphQLFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'first_name'   => 'string|max:255',
            'last_name'    => 'nullable|string|max:255',
            'age'          => 'integer',
            'gender'       => 'nullable|integer',
            'type'         => 'integer',
            'race_type_id' => 'bail|nullable|integer|exists:employee_race_types,id',
            'description'  => 'nullable|string',
            'text'         => 'nullable|string',
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
