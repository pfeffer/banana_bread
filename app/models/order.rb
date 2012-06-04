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
    values = {
       :business => 'mkmk_1335799555_biz@mail.ru',
       :cmd => '_xclick',
       #:business => '7UWLEGTUETVWL',
       :item_name => 'Banana bread',
       :quantity => self.quantity,
       :amount => BREAD_PRICE, #APP_CONFIG[:price] * quantity,
       :currency_code => 'CAD',
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
  
  def encrypt_for_paypal(values)
    signed = OpenSSL::PKCS7::sign(OpenSSL::X509::Certificate.new(APP_CERT_PEM), OpenSSL::PKey::RSA.new(APP_KEY_PEM, ''), values.map { |k, v| "#{k}=#{v}" }.join("\n"), [], OpenSSL::PKCS7::BINARY)
    OpenSSL::PKCS7::encrypt([OpenSSL::X509::Certificate.new(PAYPAL_CERT_PEM)], signed.to_der, OpenSSL::Cipher::Cipher::new("DES3"), OpenSSL::PKCS7::BINARY).to_s.gsub("\n", "")
  end
   
  def getComponentsStr
    selected_components = Array.new
    
    (self.components_mask && F_RAISINS) && selected_components.push("raisins")
    (self.components_mask && F_CHOC_CHIPS) && selected_components.push("chocolate chips")
    (self.components_mask && F_WALNUTS) && selected_components.push("walnuts")
    (self.components_mask && F_FLAX_SEEDS) && selected_components.push("flax seeds")
    (self.components_mask && F_CINNAMON) && selected_components.push("cinamon")
    
    if selected_components.length > 0
      txt = componentName(selected_components[selected_components.length-1]);
      
      #b and c
      #a, b and c
      second_last_component = selected_components.length-2;
      second_last_component.downto(0) {|i|
        if i == second_last_component
          componentText = componentName(selected_components[i]) + " and " + txt
        else
          componentText = componentName(selected_components[i]) + ", " + txt
        end
      }
      componentText = " with " + componentText
    end
    return componentText
  end
  
  def componentName(comp_name)
    return "<span class='selected-component'>" + comp_name + "</span>"
  end
end
