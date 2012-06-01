#!/usr/bin/env rake
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)
require File.expand_path('../test/javascripts/support/jasmine_config', __FILE__)

Bread::Application.load_tasks

namespace :test do
  desc "Run acceptance tests."
  task :acceptance do
    exec("casperjs test/run_acceptance.js test/acceptance")
  end
end
