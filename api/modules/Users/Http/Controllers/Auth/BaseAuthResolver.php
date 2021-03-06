<?php declare(strict_types=1);

namespace Modules\Users\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Modules\Users\Services\LoginAttemptsCounter;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;

class BaseAuthResolver
{
    protected const TOKEN_REVOKED = 'TOKEN_REVOKED';

    /**
     * @param array $credentials
     * @param string $grantType
     * @return mixed
     */
    public function buildCredentials(array $credentials, $grantType = "password")
    {
        $credentials['client_id'] = config('passport.client_id');
        $credentials['client_secret'] = config('passport.client_secret');
        $credentials['grant_type'] = $grantType;

        return $credentials;
    }

    /**
     * @param array $credentials
     * @return mixed
     * @throws AuthenticationException
     */
    public function makeRequest(array $credentials)
    {
        $request = Request::create('oauth/token', 'POST', $credentials, [], [], [
            'HTTP_Accept' => 'application/json'
        ]);
        $response = app()->handle($request);
        $decodedResponse = json_decode($response->getContent(), true);

        $statusCode = (int) $response->getStatusCode();

        if ($statusCode === 401) {
            app()->make(LoginAttemptsCounter::class)->incrementCount(\request()->ip());
        }

        if ($statusCode != 200) {
            throw new AuthenticationException($decodedResponse['message']);
        }

        return $decodedResponse;
    }
}
