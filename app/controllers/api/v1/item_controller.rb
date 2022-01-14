class Api::V1::ItemController < ApplicationController
 # before_action :set_item, only: %i[ update, destroy ]
 skip_before_action :verify_authenticity_token
    def indexItem
      @sizes = Size.all
      @companies = Company.all
      itemList = "select items.id as item_id, companies.id as company_id,
                  sizes.id as size_id, items.name, items.price, items.country, 
                  items.manafacture_date, items.email, items.remark, items.image, companies.company_name,
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
      flash[:notice] = I18n.t("message.create_success")
      Item.create(item_params)
      render json: { :successMessage => flash[:notice] }
    end
  
    def update
      # 成功するメッセージを作る。
      puts('hello item update==============', item_params);
      flash[:notice] = I18n.t("message.update_success")
      item = Item.find(params[:id])
      item.update(item_params)
      render json: {:successMessage => flash[:notice]}
    end
  
    def destroy
      #  成功するメッセージを作る。
      flash[:notice] = I18n.t("message.delete_success")
      Item.destroy(params[:id])
      # head :ok
      puts(flash[:notice]);
      render json: {:successMessage => flash[:notice]}
    end

    private
    
    def item_params
       params.require(:item).permit(:id, :name, :price, :country, :manafacture_date,
       :email, :remark, :image, :size_id, :company_id)
    end

  end
  