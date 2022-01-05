class ApplicationController < ActionController::Base
    rescue_from ActiveRecord::RecordNotFound, with: :not_found_record
    # around_action :switch_locale
    protect_from_forgery with: :null_session

private
  # エラーのexceptionを管理する。
  def not_found_record(e)
    render json: { :errors => I18n.t("message.error") }, status: :ok
  end

  # languageを管理する。
  # def switch_locale(&action)
  #   locale = params[:locale] || I18n.default_locale
  #   I18n.with_locale(locale, &action)
  # end
end
