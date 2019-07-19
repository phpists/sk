<?php declare(strict_types=1);

namespace Modules\Users\Services\Verification;

use Modules\Users\Services\CodeProcessor\Contracts\CodeProcessorInterface;
use Modules\Users\Services\Verification\Contracts\VerificationInterface;
use Modules\Users\Services\Sms\Exceptions\ValidationException;
use Modules\Users\Notifications\ResetPasswordNotification;
use Modules\Users\Services\CodeProcessor\CodeProcessor;
use Propaganistas\LaravelPhone\PhoneNumber;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Collection;
use Modules\Users\Entities\User;

/**
 * Class Verification
 */
class Verification implements VerificationInterface
{
    /**
     * @var CodeProcessor
     */
    private $codeProcessor;

    /**
     * @var Collection
     */
    public $response;

    public $user;

    /**
     * Verification constructor.
     * @param CodeProcessorInterface $codeProcessor
     */
    public function __construct(CodeProcessorInterface $codeProcessor)
    {
        $this->codeProcessor = $codeProcessor;
        $this->response = collect();
        $this->user = null;
    }

    /**
     * @param $message
     */
    public function sendCode($message)
    {
        try {
            if ($this->user instanceof User) {
                $this->user->notify(new ResetPasswordNotification(
                    $message,
                    $this->user->phone
                ));
            }

            $this->response->put('status', self::VERIFICATION_SEND_SUCCESS);
            $this->response->put('message', 'Verification request send success.');

        } catch (\Exception $e) {
            $this->response->put('status', self::VERIFICATION_CHECK_FAILED);
            $this->response->put('message', 'Verification request was failed.');

            Log::error('Verification code sending was failed: ' . $e->getMessage());
        }
    }

    /**
     * Get verification code
     * @param string $phoneNumber
     * @return string
     */
    public function getCode(string $phoneNumber): string
    {
        $now = time();
        $code = null;
        $expiresAt = null;

        try {
            $phoneNumber = static::normalizePhoneNumber($phoneNumber);
            static::validatePhoneNumber($phoneNumber);

            $code = $this->codeProcessor->generateCode(
                static::trimPhoneNumber($phoneNumber)
            );

            $this->response->put('expires_at', $now + $this->codeProcessor->getLifetime());
            $this->response->put('status', self::GENERATE_CODE_SUCCESS);
            $this->response->put('message', 'Generate code was success.');

        } catch (\Exception $e) {
            $this->response->put('status', self::GENERATE_CODE_FAILED);
            $this->response->put('message', 'Generate code was failed.');

            Log::error('Verification code generate was failed: ' . $e->getMessage());
        }

        return $code ?? '';
    }

    /**
     * Check code
     * @param string $code
     * @param string $phoneNumber
     * @param callable $callback
     */
    public function checkCode(string $code, string $phoneNumber, callable $callback = null): void
    {
        try {
            if (!is_numeric($code)) {
                throw new ValidationException('Incorrect code was provided');
            }

            $phoneNumber = static::normalizePhoneNumber($phoneNumber);
            static::validatePhoneNumber($phoneNumber);

            $success = $this->codeProcessor->validateCode(
                $code,
                static::trimPhoneNumber($phoneNumber)
            );

            if ($success && is_callable($callback)) {
                $callback();
            }

            if ($success) {
                $this->codeProcessor->deleteCode($code);
            }

            $this->response->put('status', $success ? self::VERIFICATION_CHECK_SUCCESS : self::VERIFICATION_CHECK_FAILED);

        } catch (\Exception $e) {
            $description = $e->getMessage();

            $this->response->put('status', self::VERIFICATION_CHECK_FAILED);
            $this->response->put('message', $description);

            if (!($e instanceof ValidationException)) {
                Log::error('SMS Verification check was failed: ' . $description);
            }
        }
    }

    /**
     * Response result
     * @return array
     */
    public function response(): array
    {
        return $this->response->toArray();
    }

    /**
     * Set user
     * @param $user
     * @return Verification
     */
    public function setUser($user): Verification
    {
        $this->user = $user;
        return $this;
    }

    /**
     * Normalize phone number
     * @param string $phoneNumber
     * @return string
     */
    protected static function normalizePhoneNumber(string $phoneNumber): string
    {
        return (string)PhoneNumber::make($phoneNumber);
    }

    /**
     * @param $phoneNumber
     * @return string
     */
    private static function trimPhoneNumber(string $phoneNumber): string
    {
        return trim(ltrim($phoneNumber, '+'));
    }

    /**
     * Validate phone number
     * @param string $phoneNumber
     * @throws ValidationException
     */
    protected static function validatePhoneNumber(string $phoneNumber)
    {
        // Todo: Add patterns.
        $patterns = [
            "\+?1[2-9][0-9]{2}[2-9][0-9]{2}[0-9]{4}", // US
            "\+?[2-9]\d{9,}", // International
        ];
        if (!@preg_match("/^(" . implode('|', $patterns) . ")\$/", $phoneNumber)) {
            throw new ValidationException('Incorrect phone number was provided');
        }
    }
}