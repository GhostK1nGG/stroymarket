<?php
namespace app\controllers;

use Yii;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use app\repositories\ProductRepository;

class ProductController extends Controller
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
                'create' => ['POST'],   // FormData
                'update' => ['PUT'],    // JSON
                'patch'  => ['PATCH'],  // JSON
                'delete' => ['DELETE'],
            ],
        ];
        return $b;
    }

    // GET /products
    public function actionIndex()
    {
        return $this->repo->findAll();
    }

    // GET /products/{id}
    public function actionView($id)
    {
        $m = $this->repo->findById((int)$id);
        if (!$m) $this->notFound();
        return $m;
    }

    // POST /products (FormData)
    public function actionCreate()
    {
        [$ok, $m, $errors] = $this->repo->create(Yii::$app->request->post());
        if ($ok) {
            Yii::$app->response->statusCode = 201;
            return $m;
        }
        Yii::$app->response->statusCode = 422;
        return ['errors' => $errors];
    }

    // PUT /products/{id} (JSON)
    public function actionUpdate($id)
    {
        $m = $this->repo->findById((int)$id);
        if (!$m) $this->notFound();

        $data = Yii::$app->request->bodyParams;
        [$ok, $m, $errors] = $this->repo->update($m, $data);
        if ($ok) return $m;

        Yii::$app->response->statusCode = 422;
        return ['errors' => $errors];
    }

    // PATCH /products/{id} (JSON)
    public function actionPatch($id)
    {
        $m = $this->repo->findById((int)$id);
        if (!$m) $this->notFound();

        $data = Yii::$app->request->bodyParams;
        [$ok, $m, $errors] = $this->repo->patch($m, $data);
        if ($ok) return $m;

        Yii::$app->response->statusCode = 422;
        return ['errors' => $errors];
    }

    // DELETE /products/{id}
    public function actionDelete($id)
    {
        $m = $this->repo->findById((int)$id);
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
