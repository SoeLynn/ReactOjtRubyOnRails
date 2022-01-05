class AddRemarkToItems < ActiveRecord::Migration[6.1]
  def change
    add_column :items, :remark, :string
  end
end
