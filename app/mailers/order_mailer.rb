class OrderMailer < ActionMailer::Base
  add_template_helper(ApplicationHelper)
  
  MY_EMAIL = "info@sweetbread.ca"
  default from: MY_EMAIL
  
  def email_order(order)
    @order = order
    mail(to: MY_EMAIL, subject: "Sweet bread order \#"+@order.id.to_s+" created").deliver
  end
  
  def email_order_confirmation(order)
    @order = order
    
    mail(to: [order.user_email, MY_EMAIL], subject: "Order \#"+@order.id.to_s+" confirmation for Banana Bread").deliver
  end
end
