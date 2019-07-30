<?php

namespace Modules\Api\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Modules\Users\Entities\User;

class RegistrationRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'first_name'   => 'required|string|max:255',
            'last_name'    => 'required|string|max:255',
            'phone'        => 'bail|required|string|max:255|unique:users,phone|phone:AUTO,US',
            'email'        => 'bail|required|string|email|max:255|unique:users,email',
            'password'     => 'required|string|min:6|confirmed',
            'account_type' => 'required|string|max:255|in:' . implode(',', User::REGISTER_TYPES),
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
