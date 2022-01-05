class AddEmailToItems < ActiveRecord::Migration[6.1]
  def change
    add_column :items, :email, :string
  end
end
