class OrderMailer < ActionMailer::Base
  default from: "masha.ku@gmail.com"
  
  def email_order(user_name, user_email, order)
    @user_name = user_name
    @order = order
    
    mail(to: user_email, subject: "Your order of banana bread").deliver
  end
end
