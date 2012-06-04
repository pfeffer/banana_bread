class OrderMailer < ActionMailer::Base
  MY_EMAIL = "masha.ku@gmail.com"
  default from: MY_EMAIL
  
  def email_order(order)
    @order = order
    
    mail(to: [order.user_email, MY_EMAIL], subject: "Order confirmation for Banana Bread").deliver
  end
end
