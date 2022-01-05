class RenameNameToCompanyName < ActiveRecord::Migration[6.1]
  def change
    rename_column :companies, :name, :company_name
  end
end
