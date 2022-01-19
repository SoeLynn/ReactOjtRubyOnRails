class AddSizeIdToItems < ActiveRecord::Migration[6.1]
  def change
    add_column :items, :size_id, :integer
    add_index :items, :size_id
  end
end
