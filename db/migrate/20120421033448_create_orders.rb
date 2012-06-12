class CreateOrders < ActiveRecord::Migration
  def change
    create_table :orders do |t|
      #t.string :components
      t.integer :quantity
      t.boolean :is_delivery
      t.string  :delivery_address
      t.datetime :purchased_at
      t.string :user_name
      t.string :user_email
      t.string :user_phone
      t.string :user_comment
      
      t.boolean :raisins
      t.boolean :chocolate_chips
      t.boolean :walnuts
      t.boolean :flax_seeds
      t.boolean :cinnamon

      t.timestamps
    end
  end
end
