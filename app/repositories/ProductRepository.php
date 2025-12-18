<?php
namespace app\repositories;

use app\models\Product;

class ProductRepository
{
    public function findAll(): array
    {
        return Product::find()->all();
    }

    public function findAllByUser(int $userId): array
    {
        return Product::find()->where(['user_id' => $userId])->all();
    }

    public function findById(int $id): ?Product
    {
        return Product::findOne($id);
    }

    public function findByIdForUser(int $id, int $userId): ?Product
    {
        return Product::find()->where(['id' => $id, 'user_id' => $userId])->one();
    }

    public function create(array $data): array
    {
        $m = new Product();
        $m->load($data, '');
        if ($m->validate() && $m->save()) {
            return [true, $m, null];
        }
        return [false, null, $m->getErrors()];
    }

    public function createForUser(array $data, int $userId): array
    {
        $m = new Product();
        $m->load($data, '');
        $m->user_id = $userId;
        if ($m->validate() && $m->save()) {
            return [true, $m, null];
        }
        return [false, null, $m->getErrors()];
    }

    public function update(Product $m, array $data): array
    {
        $m->load($data, '');
        if ($m->validate() && $m->save()) {
            return [true, $m, null];
        }
        return [false, null, $m->getErrors()];
    }

    public function patch(Product $m, array $data): array
    {
        foreach ($data as $attr => $val) {
            if ($m->hasAttribute($attr)) {
                $m->$attr = $val;
            }
        }
        if ($m->validate() && $m->save(false)) {
            return [true, $m, null];
        }
        return [false, null, $m->getErrors()];
    }

    public function delete(Product $m): bool
    {
        return (bool)$m->delete();
    }
}