class Api::V1::ItemController < ApplicationController
 # before_action :set_item, only: %i[ update, destroy ]
 before_action :no_login, only:[ :indexItem, :index, :create, :update, :destroy ]
 skip_before_action :verify_authenticity_token
    def indexItem
      puts("session exit", session[:user_role]);
      @sizes = Size.all
      @companies = Company.all
      itemList = "select items.id as item_id, companies.id as company_id,
                  sizes.id as size_id, items.name, items.price, items.country, 
                  items.email, items.remark, companies.company_name,
                  sizes.size from items, companies, sizes 
                  where companies.id = items.company_id
                  and sizes.id = items.size_id"
      @items = ActiveRecord::Base.connection.execute(itemList)
      # ログ出力
    #   config.logger = Logger.new('log/try.log', 'weekly')
    #   logger.datetime_format = "%Y-%m-%d %H:%M:%S"
    #   logger.formatter = proc do |severity, datetime, progname, msg|
    #   "ItemLog: #{msg}\n"
    #  end  
    #   logger.debug(@companies.inspect)
      # ログ出力の終わり

      render json: { :items => @items, :sizes => @sizes, :companies => @companies}
    end

    def exportExcel
      itemList = "select items.id as item_id, companies.id as company_id,
                  sizes.id as size_id, items.name, items.price, items.country, 
                  items.manafacture_date, items.email, items.remark, companies.company_name,
                  sizes.size from items, companies, sizes 
                  where companies.id = items.company_id
                  and sizes.id = items.size_id"
      @items = ActiveRecord::Base.connection.execute(itemList)
      render do |format|
      format.xlsx {
        response.headers[
          'Content-Disposition'
        ] = "attachment; filename='items.xlsx'"
      }
      render json: {:items => @items }
      end
    end

    def index
    end
  
    def create
      if session[:user_role] == "admin"
      flash[:notice] = I18n.t("message.create_success")
      Item.create(item_params)
      render json: { :successMessage => flash[:notice] }
      else
       render json: { :successMessage =>"許可がないので登録ができません！" }  
      end
    end
  
    def update
      # 成功するメッセージを作る。
      if session[:user_role] == "admin"
      flash[:notice] = I18n.t("message.update_success")
      item = Item.find(params[:id])
      item.update(item_params)
      render json: {:successMessage => flash[:notice]}
      else
        render json: { :successMessage =>"許可がないので更新ができません！" }  
      end
    end
  
    def destroy
      if session[:user_role] == "admin"
      #  成功するメッセージを作る。
      flash[:notice] = I18n.t("message.delete_success")
      Item.destroy(params[:id])
      render json: {:successMessage => flash[:notice]}
      else
        render json: { :successMessage =>"許可がないので削除ができません！" }  
      end
    end

    def no_login
      if !session[:user_id]
      redirect_to root_path
      end
    end

    private
    
    def item_params
       params.require(:item).permit(:name, :country, :price,
       :email, :remark, :company_name, :company_id, :size_id)
    end

  end
  