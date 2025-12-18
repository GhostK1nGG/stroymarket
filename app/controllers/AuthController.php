<?php

namespace app\controllers;

use app\models\User;
use Yii;
use yii\web\Controller;
use yii\filters\VerbFilter;

class AuthController extends Controller
{
    public $enableCsrfValidation = false;

    public function behaviors()
    {
        $b = parent::behaviors();
        $b['verbs'] = [
            'class' => VerbFilter::class,
            'actions' => [
                'register' => ['POST'],
                'login' => ['POST'],
            ],
        ];
        return $b;
    }

    public function actionRegister()
    {
        $payload = Yii::$app->request->bodyParams ?: Yii::$app->request->post();
        $email = trim((string)($payload['email'] ?? ''));
        $password = (string)($payload['password'] ?? '');
        $passwordRepeat = (string)($payload['password_repeat'] ?? '');

        $errors = [];
        if (!$email) {
            $errors['email'][] = 'Email обязателен';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'][] = 'Некорректный email';
        } elseif (User::findByEmail($email)) {
            $errors['email'][] = 'Email уже используется';
        }

        if (!$password || !$passwordRepeat) {
            $errors['password'][] = 'Пароль обязателен';
        } elseif ($password !== $passwordRepeat) {
            $errors['password'][] = 'Пароли должны совпадать';
        }

        if ($errors) {
            Yii::$app->response->statusCode = 422;
            return ['errors' => $errors];
        }

        $user = new User();
        $user->email = $email;
        $user->setPassword($password);
        $user->refreshApiToken();

        if ($user->save()) {
            return [
                'user' => $user,
                'token' => $user->api_token,
            ];
        }

        Yii::$app->response->statusCode = 422;
        return ['errors' => $user->getErrors()];
    }

    public function actionLogin()
    {
        $payload = Yii::$app->request->bodyParams ?: Yii::$app->request->post();
        $email = trim((string)($payload['email'] ?? ''));
        $password = (string)($payload['password'] ?? '');

        $user = $email ? User::findByEmail($email) : null;
        if (!$user || !$user->validatePassword($password)) {
            Yii::$app->response->statusCode = 401;
            return ['error' => 'Неверный email или пароль'];
        }

        $user->refreshApiToken();
        $user->save(false);

        return [
            'user' => $user,
            'token' => $user->api_token,
        ];
    }
}
