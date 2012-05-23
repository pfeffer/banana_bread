class OrdersController < ApplicationController
  # GET /orders
  # GET /orders.json
  def index
    @orders = Order.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @orders }
    end
  end

  # GET /orders/1
  # GET /orders/1.json
  def show
    @order = Order.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @order }
    end
  end

  # GET /orders/new
  # GET /orders/new.json
  def new
    @order = Order.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @order }
    end
  end

  # GET /orders/1/edit
  def edit
    @order = Order.find(params[:id])
  end

  # POST /orders
  # POST /orders.json
  def create
		components = params[:components][:walnuts]
		is_delivery = params[:delivery_type] == 'delivery'
		delivery_address = params[:delivery_address]
		quantity = params[:quantity]
		user_name = params[:user_name]
		user_email = params[:user_email]
		
		puts "saving the order...."
		puts ENV['BREAD_EMAIL_USERNAME']
		
    @order = Order.create!( components_mask: components, is_delivery: is_delivery, delivery_address: delivery_address, quantity: quantity, user_name: user_name, user_email: user_email )
    
    #render :json => {order_id: @order.id, paypal_encrypted_str: @order.encrypt_paypal(thank_you_url, payment_notifications_url)}
    render :json => {order_id: @order.id, paypal_encrypted_str: @order.encrypt_paypal(thank_you_url, 'http://marakujja.zapto.org/payment_notifications')}
    
    # respond_to do |format|
    #       if @order.save
    #         format.html { redirect_to @order, notice: 'Order was successfully created.' }
    #         format.json { render json: @order, status: :created, location: @order }
    #       else
    #         format.html { render action: "new" }
    #         format.json { render json: @order.errors, status: :unprocessable_entity }
    #       end
    #     end
  end

  # PUT /orders/1
  # PUT /orders/1.json
  def update
    @order = Order.find(params[:id])

    respond_to do |format|
      if @order.update_attributes(params[:order])
        format.html { redirect_to @order, notice: 'Order was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @order.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /orders/1
  # DELETE /orders/1.json
  def destroy
    @order = Order.find(params[:id])
    @order.destroy

    respond_to do |format|
      format.html { redirect_to orders_url }
      format.json { head :no_content }
    end
  end
end
