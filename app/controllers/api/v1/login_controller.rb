class Api::V1::LoginController < ApplicationController
  skip_before_action :verify_authenticity_token
    def login
    @user = User.find_by(email: user_params[:email])
    if @user && @user.authenticate(user_params[:encrypt_password])
    session[:user_id] = @user.id
    session[:user_role] = @user.role
      @userId = session[:user_id];
      render json: { :userId => @userId}
    else
        flash[:notice] = "login fail"
        render json: { :successMessage => flash[:notice] }
    end
    end

    def logout
      session.delete(:user_id)
      session.delete(:user_role)
      render json: { :successMessage => "ログアウトが成功しました。" }
    end

    private
    def user_params
       params.require(:user).permit(:email, :encrypt_password);
    end
end