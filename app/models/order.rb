class Order < ActiveRecord::Base
  
  def paypal_form(return_url, notify_url)
    values = {
       #business: 'mkmk_1335799555_biz@mail.ru',
       :cmd => '_xclick',
       :business => '7UWLEGTUETVWL',
       :item_name => 'Banana bread',
       :quantity => self.quantity,
       :lc => 'CA',
       :amount => 20 * self.quantity, #APP_CONFIG[:price] * quantity,
       :currency_code => 'USD',
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
    values = {
       :business => 'mkmk_1335799555_biz@mail.ru',
       :cmd => '_xclick',
       #:business => '7UWLEGTUETVWL',
       :item_name => 'Banana bread',
       :quantity => self.quantity,
       :amount => 20 * self.quantity, #APP_CONFIG[:price] * quantity,
       :currency_code => 'USD',
       :invoice => self.id,
       :rm => 0,
       #:button_subtype => 'services',
       #:bn => "PP-BuyNowBF:btn_buynowCC_LG.gif:NonHosted",
       :return => return_url,
       :notify_url => notify_url,
       :cert_id => 'Q676RQJ8RDHWY'
     }
     y values
     
     encrypt_for_paypal(values)
  end
  
  PAYPAL_CERT_PEM = File.read("#{Rails.root}/certs/paypal_cert.pem")
  APP_CERT_PEM = File.read("#{Rails.root}/certs/app_cert.pem")
  APP_KEY_PEM = File.read("#{Rails.root}/certs/app_key.pem")

  def encrypt_for_paypal(values)
    signed = OpenSSL::PKCS7::sign(OpenSSL::X509::Certificate.new(APP_CERT_PEM), OpenSSL::PKey::RSA.new(APP_KEY_PEM, ''), values.map { |k, v| "#{k}=#{v}" }.join("\n"), [], OpenSSL::PKCS7::BINARY)
    OpenSSL::PKCS7::encrypt([OpenSSL::X509::Certificate.new(PAYPAL_CERT_PEM)], signed.to_der, OpenSSL::Cipher::Cipher::new("DES3"), OpenSSL::PKCS7::BINARY).to_s.gsub("\n", "")
  end
end
