class OrderMailer < ActionMailer::Base
  default from: "masha.ku@gmail.com"
  
  def email_order(order)
    @order = order
    
    mail(to: [order.user_email, 'masha.ku@gmail.com'], subject: "Your order of banana bread").deliver
  end
end
