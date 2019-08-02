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
        $root = [
            'account_type' => 'required|string|max:255|in:' . implode(',', User::REGISTER_TYPES),
            'first_name'   => 'required|string|max:255',
            'last_name'    => 'nullable|string|max:255',
            'phone'        => 'bail|required|string|max:255|unique:users,phone|phone:AUTO,US',
            'email'        => 'bail|required|string|email|max:255|unique:users,email',
            'password'     => 'required|string|min:6|confirmed',
        ];

        switch ($this->request->get('account_type')) {
            case User::ACCOUNT_CLUB_OWNER:
                $root = array_merge($root, [
                    'club_type' => 'required|string|max:255',
                ]);
                break;
            case User::ACCOUNT_GIRL:
                $root = array_merge($root, [
                    'gender'   => 'required|numeric|in:' . implode(',', User::REGISTER_GENDERS),
                    'birthday' => 'required|date',
                    'lat'      => 'nullable|string',
                    'lng'      => 'nullable|string',
                ]);
                break;
            case User::ACCOUNT_CLIENT:
                $root = array_merge($root, [
                    'gender'   => 'required|numeric|in:' . implode(',', User::REGISTER_GENDERS),
                    'birthday' => 'required|date',
                ]);
                break;
            default:
                break;
        }

        return $root;
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