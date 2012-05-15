class Order < ActiveRecord::Base
  serialize :components
end
