class ApplicationController < ActionController::Base
   include Pundit
    rescue_from ActiveRecord::RecordNotFound, with: :not_found_record
    rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
    # around_action :switch_locale
    protect_from_forgery with: :null_session

private
  # エラーのexceptionを管理する。
  def not_found_record(e)
    render json: { :errors => I18n.t("message.error") }, status: :ok
  end

  # ユーザーauthorizeがない場合管理する機能
  def user_not_authorized
      render json: { :errors => "このアクションを実行する権限がありません。" }, status: :ok
    end

  # languageを管理する。
  # def switch_locale(&action)
  #   locale = params[:locale] || I18n.default_locale
  #   I18n.with_locale(locale, &action)
  # end
end
