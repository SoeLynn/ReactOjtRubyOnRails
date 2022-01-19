class Api::V1::UserController < ApplicationController
  before_action :no_login, only:[ :indexItem, :index, :create, :update, :destroy ]
 skip_before_action :verify_authenticity_token
  def indexUser
  end

  def index

  end

  def create
    if session[:user_role] == "admin"
    @users = User.all
    flash[:notice] = "新しいユーザーを保存できました。"
    User.create(user_params)
    render json: { :successMessage => flash[:notice], :users => @users }
    else
       render json: { :successMessage =>"許可がないので登録ができません！" }  
    end
  end

  def update
  end

  def destroy 
  end

  def no_login
      if !session[:user_id]
      redirect_to root_path
      end
    end

   private
    def user_params
       params.require(:user).permit(:user_name, :email, :role, :password)
    end
end
