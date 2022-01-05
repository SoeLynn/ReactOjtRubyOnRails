Rails.application.routes.draw do
  get 'users', to: "api/v1/user#index"
 # get 'items', to: "api/v1/item#index"
  devise_for :users
  namespace :api do
    namespace :v1 do
      # ユーザー管理画面
      get 'user/indexUser', to: "user#indexUser"
    end
  end
  get 'home/index'
  root 'home#index'

  # フォームロードするroute_path
  get 'items', to: "api/v1/item#index"
  namespace :api do
    namespace :v1 do
      # フォームロードするroute_path
       get 'item', to: "item#indexItem"
       # excel fileを出すroute_path
       get 'export_excel', to: "item#exportExcel"
       # 新しいアイテムを作成するroute_path
      post 'item', to: "item#create"
      # アイテムを削除するroute_path
      delete 'items/:id', to: "item#destroy"
      # アイテムを更新するroute_path
      post 'item/update/:id', to: "item#update"
    end
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
