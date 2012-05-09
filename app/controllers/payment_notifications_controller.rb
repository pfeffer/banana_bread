class PaymentNotificationsController < ApplicationController
  protect_from_forgery except: [:create]

  def create
    PaymentNotification.create!(params: params, order_id: params[:order_id], status: params[:payment_status], transaction_id: params[:txn_id] )
    #PaymentNotification.create!(params: params)
    render :nothing => true
  end
end
