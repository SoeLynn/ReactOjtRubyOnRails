class Api::V1::LoginController < ApplicationController
    def login
    # pass = User.find(user_params[:password])
    puts('decrypt password', user_params[:encrypt_password]);
    user_id = "select id from users where users.email=user_params[:email] and users.password_digest=user_params[:encrypt_password]"
    @user_id = ActiveRecord::Base.connection.execute(user_id)
    end

    ActiveRecord::Encryption.key_provider = MyKeyProvider.new
    class MyKeyProvider
    def encryption_key
        encrypted_message
    end

    def decryption_keys(encrypted_message)
    end
    end

    private
    def user_params
       params.require(:user).permit(:email, :encrypt_password);
    end
end