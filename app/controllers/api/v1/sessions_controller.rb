class Api::V1::LoginController < ApplicationController
    def login
    @user = User.find_by(email: user_params[:email])
    puts('hello user id = ', @user.id);
    if @user && @user.authenticate(user_params[:encrypt_password])
    session[:user_id] = @user.id
      puts("Logged in successfully.", session[:user_id])
    else
        puts("Logged in fail.")
        flash[:notice] = "login fail"
        render json: { :successMessage => flash[:notice] }
    end
    # puts('decrypt password', user_params[:encrypt_password]);
    # user_id = "select id from users where users.email=user_params[:email] and users.password_digest=user_params[:encrypt_password]"
    # @user_id = ActiveRecord::Base.connection.execute(user_id)
    end

    private
    def user_params
       params.require(:user).permit(:email, :encrypt_password);
    end
end