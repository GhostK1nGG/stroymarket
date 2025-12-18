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
        // Сохраняем текущий уровень отчётности об ошибках
        $prevLevel = error_reporting();
        // Отключаем только DEPRECATED, остальное (warnings, notices, fatal) остаётся
        error_reporting($prevLevel & ~E_DEPRECATED & ~E_USER_DEPRECATED);

        $this->stdout("Запуск WebSocket-сервера на порту {$port}\n");

        $server = IoServer::factory(
            new HttpServer(
                new WsServer(new Chat())
            ),
            (int) $port
        );

        try {
            // Бесконечный цикл — команда "висит", это нормально
            $server->run();
        } finally {
            // Возвращаем исходный уровень error_reporting на всякий случай
            error_reporting($prevLevel);
        }

        return ExitCode::OK;
    }
}
