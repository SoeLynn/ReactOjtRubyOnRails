class Item < ApplicationRecord
    belongs_to :company
    belongs_to :size
    # validates :name, uniqueness: true
    # validates :country, uniqueness: true
    # validates :price, uniqueness: true
    # validates :company_id, uniqueness: true
    # validates :size_id, uniqueness: true
end
