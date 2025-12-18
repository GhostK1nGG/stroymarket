<?php

namespace app\controllers;

use app\components\TokenAuthenticator;
use app\repositories\ProductRepository;
use Yii;
use yii\filters\VerbFilter;
use yii\web\Controller;
use yii\web\NotFoundHttpException;

class ProtectedProductController extends Controller
{
    public $enableCsrfValidation = false;

    private ProductRepository $repo;

    public function init()
    {
        parent::init();
        $this->repo = new ProductRepository();
    }

    public function behaviors()
    {
        $b = parent::behaviors();
        $b['verbs'] = [
            'class' => VerbFilter::class,
            'actions' => [
                'index'  => ['GET'],
                'view'   => ['GET'],
                'create' => ['POST'],
                'update' => ['PUT'],
                'patch'  => ['PATCH'],
                'delete' => ['DELETE'],
            ],
        ];
        $b['authenticator'] = [
            'class' => TokenAuthenticator::class,
        ];
        return $b;
    }

    public function actionIndex()
    {
        $userId = (int)Yii::$app->user->id;
        return $this->repo->findAllByUser($userId);
    }

    public function actionView($id)
    {
        $m = $this->repo->findByIdForUser((int)$id, (int)Yii::$app->user->id);
        if (!$m) $this->notFound();
        return $m;
    }

    public function actionCreate()
    {
        [$ok, $m, $errors] = $this->repo->createForUser(
            Yii::$app->request->bodyParams ?: Yii::$app->request->post(),
            (int)Yii::$app->user->id
        );
        if ($ok) {
            Yii::$app->response->statusCode = 201;
            return $m;
        }
        Yii::$app->response->statusCode = 422;
        return ['errors' => $errors];
    }

    public function actionUpdate($id)
    {
        $m = $this->repo->findByIdForUser((int)$id, (int)Yii::$app->user->id);
        if (!$m) $this->notFound();

        $data = Yii::$app->request->bodyParams;
        unset($data['user_id']);
        [$ok, $m, $errors] = $this->repo->update($m, $data);
        if ($ok) return $m;

        Yii::$app->response->statusCode = 422;
        return ['errors' => $errors];
    }

    public function actionPatch($id)
    {
        $m = $this->repo->findByIdForUser((int)$id, (int)Yii::$app->user->id);
        if (!$m) $this->notFound();

        $data = Yii::$app->request->bodyParams;
        unset($data['user_id']);
        [$ok, $m, $errors] = $this->repo->patch($m, $data);
        if ($ok) return $m;

        Yii::$app->response->statusCode = 422;
        return ['errors' => $errors];
    }

    public function actionDelete($id)
    {
        $m = $this->repo->findByIdForUser((int)$id, (int)Yii::$app->user->id);
        if (!$m) $this->notFound();

        $this->repo->delete($m);
        return ['status' => 'ok'];
    }

    private function notFound(): void
    {
        Yii::$app->response->statusCode = 404;
        throw new NotFoundHttpException('Продукт не найден');
    }
}
