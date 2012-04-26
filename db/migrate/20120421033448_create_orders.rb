class CreateOrders < ActiveRecord::Migration
  def change
    create_table :orders do |t|
      t.integer :components_mask
      t.integer :quantity

      t.timestamps
    end
  end
end
