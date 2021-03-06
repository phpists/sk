<?php

namespace Modules\Users\Http\Requests\Auth;

use Modules\Api\Extensions\GraphQLFormRequest;
use Modules\Users\Rules\CaptchaRule;

class SendVerificationRequest extends GraphQLFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'phone'     => 'bail|required|string|phone:AUTO,CH|unique:users',
//            'recaptcha' => ['bail', 'required', 'string', new CaptchaRule],
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
