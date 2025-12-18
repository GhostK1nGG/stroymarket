<?php

use yii\db\Migration;

class m251120_000001_create_user_table extends Migration
{
    public function safeUp()
    {
        $this->createTable('{{%user}}', [
            'id' => $this->primaryKey(),
            'email' => $this->string(255)->notNull()->unique(),
            'password_hash' => $this->string()->notNull(),
            'api_token' => $this->string(64)->notNull()->unique(),
            'auth_key' => $this->string(32),
            'created_at' => $this->integer()->notNull(),
            'updated_at' => $this->integer()->notNull(),
        ]);
    }

    public function safeDown()
    {
        $this->dropTable('{{%user}}');
    }
}
