<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%product}}`.
 */
class m251020_175511_create_product_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%product}}', [
            'id' => $this->primaryKey(),
            'sku' => $this->string(64)->notNull()->unique(),
            'name' => $this->string(255)->notNull(),
            'price' => $this->decimal(10,2)->notNull()->defaultValue(0),
            'quantity' => $this->integer()->notNull()->defaultValue(0),
            'created_at' => $this->integer()->notNull(),
            'updated_at' => $this->integer()->notNull(),
        ]);
    }
    public function safeDown()
    {
        $this->dropTable('{{%product}}');
    }

}
