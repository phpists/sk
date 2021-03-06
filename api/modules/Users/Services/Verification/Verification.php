<?php declare(strict_types=1);

namespace Modules\Users\Services\Verification;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Modules\Api\Http\Controllers\Traits\Statusable;
use Modules\Users\Entities\User;
use Modules\Users\Notifications\ResetPasswordNotification;
use Modules\Users\Services\CodeProcessor\CodeProcessor;
use Modules\Users\Services\CodeProcessor\Contracts\CodeProcessorInterface;
use Modules\Users\Services\Sms\Exceptions\ValidationException;
use Modules\Users\Services\Verification\Contracts\VerificationInterface;
use Propaganistas\LaravelPhone\PhoneNumber;

/**
 * Class Verification
 */
class Verification implements VerificationInterface
{
    use Statusable;

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
        $this->response = [];
        $this->user = null;
    }

    /**
     * @param $message
     */
    public function sendCode($message)
    {
        try {
            if (is_null($this->user)) {
                throw new \Exception("User with such a phone is not found");
            }

            if ($this->user instanceof User) {
                $this->user->notify(new ResetPasswordNotification(
                    $message,
                    $this->user->phone
                ));
            }

            $this->response = $this->success(self::VERIFICATION_SEND_SUCCESS);

        } catch (\Exception $e) {
            $this->response = $this->fail(self::VERIFICATION_SEND_FAILED);

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

            $code = $this->codeProcessor->generateCode(
                static::trimPhoneNumber($phoneNumber)
            );

            $this->response = array_merge(
                $this->success(self::GENERATE_CODE_SUCCESS),
                ['expires_at' => $now + $this->codeProcessor->getLifetime()]
            );

        } catch (\Exception $e) {
            $this->response = $this->fail(self::GENERATE_CODE_FAILED);
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

            $this->response = $success ? $this->success(self::VERIFICATION_CHECK_SUCCESS)
                : $this->fail(self::VERIFICATION_CHECK_FAILED);

        } catch (\Exception $e) {
            $this->response = $this->fail(self::VERIFICATION_CHECK_FAILED);

            if (!($e instanceof ValidationException)) {
                Log::error('SMS Verification check was failed: ' . $e->getMessage());
            }
        }
    }

    /**
     * Check status
     * @param string $phoneNumber
     * @param callable $callback
     */
    public function checkStatus(string $phoneNumber, callable $callback = null): void
    {
        try {
            $phoneNumber = static::normalizePhoneNumber($phoneNumber);

            $success = $this->codeProcessor->validateStatus(
                static::trimPhoneNumber($phoneNumber)
            );

            if ($success && is_callable($callback)) {
                $callback();
            }

            $this->response = $this->success($success ? self::VERIFICATION_STATUS_SUCCESS : self::VERIFICATION_STATUS_FAILED);

        } catch (\Exception $e) {
            $this->response = $this->fail(self::VERIFICATION_STATUS_FAILED);
        }
    }

    /**
     * Response result
     * @return array
     */
    public function response(): array
    {
        return $this->response;
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
}
