<?php

namespace app\components;

use app\models\User;
use yii\filters\auth\AuthMethod;

class TokenAuthenticator extends AuthMethod
{
    public string $header = 'Authorization';

    public function authenticate($user, $request, $response)
    {
        $authHeader = $request->getHeaders()->get($this->header);
        if (!$authHeader) {
            return null;
        }

        $token = $this->extractToken($authHeader);
        if (!$token) {
            return null;
        }

        $identity = User::findIdentityByAccessToken($token);
        if ($identity !== null) {
            $user->switchIdentity($identity);
            return $identity;
        }

        $this->handleFailure($response);
        return null;
    }

    protected function extractToken(string $headerValue): ?string
    {
        if (preg_match('/^Bearer\s+(.*)$/i', $headerValue, $matches)) {
            return trim($matches[1]);
        }
        if (preg_match('/^Token\s+(.*)$/i', $headerValue, $matches)) {
            return trim($matches[1]);
        }
        return trim($headerValue);
    }

    public function handleFailure($response)
    {
        $response->statusCode = 401;
        $response->data = ['error' => 'Unauthorized'];
        $response->send();
    }
}
