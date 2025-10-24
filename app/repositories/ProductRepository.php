<?php
namespace app\repositories;

use app\models\Product;

class ProductRepository
{
    public function findAll(): array
    {
        return Product::find()->all();
    }

    public function findById(int $id): ?Product
    {
        return Product::findOne($id);
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