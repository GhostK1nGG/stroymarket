<?php

namespace app\commands;

use yii\console\Controller;
use yii\console\ExitCode;
use app\models\Product;

/**
 * Консольные команды для работы с товарами.
 *
 * Примеры:
 *   docker compose exec php php yii product/list
 *   docker compose exec php php yii product/create
 *   docker compose exec php php yii product/update 3
 *   docker compose exec php php yii product/delete 3
 */
class ProductController extends Controller
{
    /**
     * Вывести список товаров
     */
    public function actionList()
    {
        $products = Product::find()->all();

        if (!$products) {
            $this->stdout("Товаров нет\n");
            return ExitCode::OK;
        }

        foreach ($products as $p) {
            $this->stdout(sprintf(
                "#%d | %s | sku: %s | price: %s\n",
                $p->id,
                $p->name,
                $p->sku,
                $p->price
            ));
        }

        return ExitCode::OK;
    }

    /**
     * Создать товар (интерактивно)
     */
    public function actionCreate()
    {
        $model = new Product();

        // обязательные поля — мы их знаем точно
        $model->name = $this->prompt('Название:', ['required' => true]);
        $model->sku = $this->prompt('Артикул (sku):', ['required' => true]);
        $model->price = $this->prompt('Цена:', [
            'required' => true,
            'validator' => function ($input, &$error) {
                if (!is_numeric($input)) {
                    $error = 'Цена должна быть числом';
                    return false;
                }
                return true;
            }
        ]);

        if ($model->validate() && $model->save()) {
            $this->stdout("Товар #{$model->id} создан\n");
            return ExitCode::OK;
        }

        $this->stderr("Не удалось создать товар:\n");
        foreach ($model->getFirstErrors() as $field => $error) {
            $this->stderr("- {$field}: {$error}\n");
        }
        return ExitCode::UNSPECIFIED_ERROR;
    }

    /**
     * Обновить товар по id
     * @param int $id
     */
    public function actionUpdate($id)
    {
        $model = Product::findOne($id);
        if (!$model) {
            $this->stderr("Товар #{$id} не найден\n");
            return ExitCode::NOUSER;
        }

        $this->stdout("Редактирование товара #{$id}\n");

        $name = $this->prompt("Название [{$model->name}]:", ['required' => false]);
        $sku = $this->prompt("SKU [{$model->sku}]:", ['required' => false]);
        $price = $this->prompt("Цена [{$model->price}]:", ['required' => false]);

        if ($name !== '') {
            $model->name = $name;
        }
        if ($sku !== '') {
            $model->sku = $sku;
        }
        if ($price !== '') {
            if (!is_numeric($price)) {
                $this->stderr("Цена должна быть числом\n");
                return ExitCode::UNSPECIFIED_ERROR;
            }
            $model->price = $price;
        }

        if ($model->validate() && $model->save()) {
            $this->stdout("Товар #{$model->id} обновлён\n");
            return ExitCode::OK;
        }

        $this->stderr("Не удалось обновить товар:\n");
        foreach ($model->getFirstErrors() as $field => $error) {
            $this->stderr("- {$field}: {$error}\n");
        }
        return ExitCode::UNSPECIFIED_ERROR;
    }

    /**
     * Удалить товар
     * @param int $id
     */
    public function actionDelete($id)
    {
        $model = Product::findOne($id);
        if (!$model) {
            $this->stderr("Товар #{$id} не найден\n");
            return ExitCode::NOUSER;
        }

        if (!$this->confirm("Удалить #{$id} ({$model->name})?")) {
            $this->stdout("Отменено\n");
            return ExitCode::OK;
        }

        $model->delete();
        $this->stdout("Удалено\n");
        return ExitCode::OK;
    }
}
