class CreateOrders < ActiveRecord::Migration
  def change
    create_table :orders do |t|
      t.string :components_mask
      t.integer :quantity
      t.integer :is_delivery
      t.string  :delivery_address
      t.datetime :purchased_at
      t.string :user_name
      t.string :user_email

      t.timestamps
    end
  end
end
