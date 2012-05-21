APP_CONFIG = YAML.load_file("#{Rails.root}/config/config.yml")

ActionMailer::Base.smtp_settings = {
  :address              => "smtp.gmail.com",
  :port                 => 587,
  :user_name            => APP_CONFIG['email_username'],
  :password             => APP_CONFIG['email_password'],
  :authentication       => 'plain',
  :enable_starttls_auto => true  }