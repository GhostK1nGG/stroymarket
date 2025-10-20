<?php
namespace app\controllers;

use Yii;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use app\models\Product;

class ProductController extends Controller
{
    public $enableCsrfValidation = false; // API

    // GET /products
    public function actionIndex()
    {
        return Product::find()->all();
    }

    // GET /products/{id}
    public function actionView($id)
    {
        return $this->find($id);
    }

    // POST /products  (FormData)
    public function actionCreate()
    {
        $model = new Product();
        $model->load(Yii::$app->request->post(), ''); // FormData
        if ($model->validate() && $model->save()) {
            Yii::$app->response->statusCode = 201;
            return $model;
        }
        Yii::$app->response->statusCode = 422;
        return ['errors' => $model->getErrors()];
    }

    // PUT /products/{id} (JSON)
    public function actionUpdate($id)
    {
        $model = $this->find($id);
        $data = Yii::$app->request->bodyParams; // JSON
        $model->load($data, '');
        if ($model->validate() && $model->save()) {
            return $model;
        }
        Yii::$app->response->statusCode = 422;
        return ['errors' => $model->getErrors()];
    }

    // PATCH /products/{id} (JSON)
    public function actionPatch($id)
    {
        $model = $this->find($id);
        $data = Yii::$app->request->bodyParams;
        foreach ($data as $attr => $val) {
            if ($model->hasAttribute($attr)) $model->$attr = $val;
        }
        if ($model->validate() && $model->save(false)) {
            return $model;
        }
        Yii::$app->response->statusCode = 422;
        return ['errors' => $model->getErrors()];
    }

    // DELETE /products/{id}
    public function actionDelete($id)
    {
        $model = $this->find($id);
        $model->delete();
        return ['status' => 'ok'];
    }

    private function find($id)
    {
        $m = Product::findOne($id);
        if (!$m) {
            Yii::$app->response->statusCode = 404;
            throw new NotFoundHttpException('Продукт не найден');
        }
        return $m;
    }
}
