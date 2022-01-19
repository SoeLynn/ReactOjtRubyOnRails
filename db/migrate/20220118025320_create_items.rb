class CreateItems < ActiveRecord::Migration[6.1]
  def change
    create_table :items do |t|
      t.string :name
      t.string :country
      t.integer :price
      t.string :email
      t.string :remark
      t.string :company_name

      t.timestamps
    end
  end
end
