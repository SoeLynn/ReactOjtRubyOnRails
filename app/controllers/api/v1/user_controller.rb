class Api::V1::UserController < ApplicationController
 skip_before_action :verify_authenticity_token
  def indexUser
  end

  def index

  end

  def create
    @users = User.all
    flash[:notice] = "新しいユーザーを保存できました。"
    User.create(user_params)
    render json: { :successMessage => flash[:notice], :users => @users }
  end

  def update
  end

  def destroy 
  end

   private
    def user_params
       params.require(:user).permit(:user_name, :email, :password)
    end
end
