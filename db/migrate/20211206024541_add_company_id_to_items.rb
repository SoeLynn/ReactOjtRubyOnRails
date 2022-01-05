class AddCompanyIdToItems < ActiveRecord::Migration[6.1]
  def change
    add_column :items, :company_id, :integer
    add_index :items, :company_id
  end
end
