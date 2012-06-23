class PaymentNotification < ActiveRecord::Base
  belongs_to :order
  serialize :params #converts a hash into yaml to store in db
  after_create :mark_order_as_purchased
  
  private
    def mark_order_as_purchased
      if status == "Completed"
        order.update_attribute(:purchased_at, Time.now)
        
        OrderMailer.email_order_confirmation(order)
      end
    end
end
