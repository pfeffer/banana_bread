class Order < ActiveRecord::Base
  validates :user_name, :presence => true
  validates :user_email, :presence => true, :format => {:with => /\A[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+\z/}
  validates :user_phone, :presence => true, :if => lambda { |order| order.is_delivery == 1}

  PAYPAL_CERT_PEM = File.read("#{Rails.root}/certs/paypal_cert.pem")
  APP_CERT_PEM = File.read("#{Rails.root}/certs/app_cert.pem")
  APP_KEY_PEM = File.read("#{Rails.root}/certs/app_key.pem")
  
  BREAD_PRICE = 15
  DELIVERY_PRICE = 5
  
  def paypal_form(return_url, notify_url)
    values = {
       #business: 'mkmk_1335799555_biz@mail.ru',
       :cmd => '_xclick',
       :business => '7UWLEGTUETVWL',
       :item_name => 'Banana bread',
       :quantity => self.quantity,
       :lc => 'CA',
       :amount => BREAD_PRICE,
       :currency_code => 'CAD',
       :invoice => self.id,
       :button_subtype => 'services',
       :bn => "PP-BuyNowBF:btn_buynowCC_LG.gif:NonHosted",
       :return => return_url,
       :notify_url => notify_url,
       :cert_id => 'Q676RQJ8RDHWY'
     }
     
     'https://www.sandbox.paypal.com/cgi-bin/webscr?'+values.to_query
  end
  
  def encrypt_paypal(return_url, notify_url)
    #Banana bread (2) with delivery
    item_name = 'Banana bread'
    if self.is_delivery
      item_name = item_name + " with delivery"
    end
    values = {
       #:business => 'mkmk_1335799555_biz@mail.ru', #dev env
       :business => 'masha@sweetbread.ca',
       :cmd => '_xclick',
       #:business => '7UWLEGTUETVWL',
       :item_name => item_name,
       :quantity => self.quantity,
       :amount => BREAD_PRICE, #APP_CONFIG[:price] * quantity,
       :currency_code => 'CAD',
       :invoice => self.id,
       :rm => 0,
       :return => return_url,
       :notify_url => notify_url,
       #:cert_id => 'Q676RQJ8RDHWY' # dev env
       :cert_id => '9H3H7AMEM2REN'
     }
     if self.is_delivery
       values[:shipping] = DELIVERY_PRICE
     end
     y values
     
     encrypt_for_paypal(values)
  end
  
  def encrypt_for_paypal(values)
    signed = OpenSSL::PKCS7::sign(OpenSSL::X509::Certificate.new(APP_CERT_PEM), OpenSSL::PKey::RSA.new(APP_KEY_PEM, ''), values.map { |k, v| "#{k}=#{v}" }.join("\n"), [], OpenSSL::PKCS7::BINARY)
    OpenSSL::PKCS7::encrypt([OpenSSL::X509::Certificate.new(PAYPAL_CERT_PEM)], signed.to_der, OpenSSL::Cipher::Cipher::new("DES3"), OpenSSL::PKCS7::BINARY).to_s.gsub("\n", "")
  end
   
  def get_selected_components
    components = []
    components.push('raisins') && self.raisins
    components.push('chocolate chips') && self.chocolate_chips
    components.push('walnuts') && self.walnuts
    components.push('flax seeds') && self.flax_seeds
    components.push('cinnamon') && self.cinnamon
    return components
  end
end
