<?php
namespace app\models;

use yii\db\ActiveRecord;

class Product extends ActiveRecord
{
    public static function tableName() { return '{{%product}}'; }

    public function rules()
    {
        return [
            [['sku','name'], 'required', 'message' => '{attribute} обязателен'],
            [['sku'], 'string', 'max' => 64],
            [['name'], 'string', 'max' => 255],
            [['price'], 'number', 'min' => 0],
            [['quantity'], 'integer', 'min' => 0],
            [['sku'], 'unique', 'message' => 'SKU уже используется'],
        ];
    }

    public function fields()
    {
        return ['id','sku','name','price','quantity','created_at','updated_at'];
    }

    public function beforeSave($insert)
    {
        $time = time();
        if ($insert) $this->created_at = $time;
        $this->updated_at = $time;
        return parent::beforeSave($insert);
    }
}
