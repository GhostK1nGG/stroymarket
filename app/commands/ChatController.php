<?php

namespace app\commands;

use app\components\Chat;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use yii\console\Controller;
use yii\console\ExitCode;

class ChatController extends Controller
{
    /**
     * Запуск WebSocket-сервера чата.
     *
     * Пример:
     * php yii chat/run 8080
     *
     * @param int $port
     * @return int
     */
    public function actionRun($port = 8080)
    {
        $this->stdout("Запуск WebSocket-сервера на порту {$port}\n");

        $server = IoServer::factory(
            new HttpServer(
                new WsServer(new Chat())
            ),
            (int) $port
        );

        $server->run();

        return ExitCode::OK;
    }
}
