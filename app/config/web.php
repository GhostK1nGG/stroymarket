<?php

$params = require __DIR__ . '/params.php';
$db = require __DIR__ . '/db.php';

$config = [
    'id' => 'basic',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'aliases' => [
        '@bower' => '@vendor/bower-asset',
        '@npm'   => '@vendor/npm-asset',
    ],
    'components' => [
        'request' => [
            'cookieValidationKey' => '-EMLvAdLYxckT6tQxJhrS7MuDkCBaVpB',
            // важное: позволяем принимать JSON-тела (для PUT/PATCH)
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
            ],
        ],
        // все ответы — в JSON
        'response' => [
            'format' => \yii\web\Response::FORMAT_JSON,
        ],
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        // сессии/логин нам сейчас не нужны, но оставим как есть — не мешают
        'user' => [
            'identityClass' => 'app\models\User',
            'enableAutoLogin' => true,
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'mailer' => [
            'class' => \yii\symfonymailer\Mailer::class,
            'viewPath' => '@app/mail',
            'useFileTransport' => true,
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'db' => $db,

        // включаем красивые URL и наши API-правила
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'rules' => [
                // Product CRUD:
                'GET products'                 => 'product/index',   // список
                'GET products/<id:\d+>'        => 'product/view',    // один
                'POST products'                => 'product/create',  // создание (FormData)
                'PUT products/<id:\d+>'        => 'product/update',  // полное обновление (JSON)
                'PATCH products/<id:\d+>'      => 'product/patch',   // частичное обновление (JSON)
                'DELETE products/<id:\d+>'     => 'product/delete',  // удаление
            ],
        ],
    ],
    'params' => $params,
];

if (YII_ENV_DEV) {
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
        // 'allowedIPs' => ['127.0.0.1', '::1'],
    ];

    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
        // 'allowedIPs' => ['127.0.0.1', '::1'],
    ];
}

return $config;
