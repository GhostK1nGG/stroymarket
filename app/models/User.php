<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;
use yii\web\IdentityInterface;

class User extends ActiveRecord implements IdentityInterface
{
    public static function tableName()
    {
        return '{{%user}}';
    }

    public function rules()
    {
        return [
            [['email', 'password_hash', 'api_token'], 'required'],
            ['email', 'email'],
            ['email', 'string', 'max' => 255],
            ['email', 'unique'],
            [['password_hash'], 'string', 'max' => 255],
            [['api_token'], 'string', 'max' => 64],
            [['api_token'], 'unique'],
            [['auth_key'], 'string', 'max' => 32],
            [['created_at', 'updated_at'], 'integer'],
        ];
    }

    public function fields()
    {
        return ['id', 'email', 'created_at', 'updated_at'];
    }

    public static function findIdentity($id)
    {
        return static::findOne($id);
    }

    public static function findIdentityByAccessToken($token, $type = null)
    {
        return static::findOne(['api_token' => $token]);
    }

    public static function findByEmail(string $email): ?self
    {
        return static::findOne(['email' => $email]);
    }

    public static function findByUsername(string $username): ?self
    {
        return static::findByEmail($username);
    }

    public function getId()
    {
        return $this->id;
    }

    public function getAuthKey()
    {
        return $this->auth_key;
    }

    public function validateAuthKey($authKey)
    {
        return $this->auth_key === $authKey;
    }

    public function validatePassword(string $password): bool
    {
        return Yii::$app->security->validatePassword($password, $this->password_hash);
    }

    public function setPassword(string $password): void
    {
        $this->password_hash = Yii::$app->security->generatePasswordHash($password);
    }

    public function refreshApiToken(): void
    {
        $this->api_token = Yii::$app->security->generateRandomString(32);
    }

    public function beforeSave($insert)
    {
        if ($this->isNewRecord && empty($this->api_token)) {
            $this->refreshApiToken();
        }
        if ($this->isNewRecord && empty($this->auth_key)) {
            $this->auth_key = Yii::$app->security->generateRandomString(32);
        }
        $time = time();
        if ($insert && empty($this->created_at)) {
            $this->created_at = $time;
        }
        $this->updated_at = $time;
        return parent::beforeSave($insert);
    }
}
