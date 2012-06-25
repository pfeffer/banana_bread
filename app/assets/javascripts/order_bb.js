bread.initOrderBackbone = function() {
  bread.OrderModel = Backbone.Model.extend({
    defaults: {
      quantity: 1,
      components: {
        "raisins": false,
        "chocolate chips": false,
        "walnuts": false,
        "flax seeds": false,
        "cinnamon": false
			},
			step: 1,
			max_step: 1,
			delivery_type: 'pickup',	//1 - pickup, 2 - delivery
			delivery_address: '',
			delivery_distance: 0, // in metres
			order_id: 0,
			paypal_encrypted: '',
			user_name: '',
			user_email: '',
			user_comment: '',
			user_phone: '',
			form_fields_errors: {
				"user-name": "",
				"user-email": "",
				"delivery-address": "",
				"user-phone":""
			},
			loaf_price: 15,
			delivery_price: 5
		},
		availableComponents: {
		    "raisins": "./assets/raisins.jpg",
		    "chocolate chips": "./assets/chocolate-chips.jpg",
		    "walnuts": "./assets/walnuts.jpg",
		    "flax seeds": "./assets/flax-seeds.jpg",
		    "cinnamon": "./assets/cinnamon.jpg"
		},
		initialize: function() {},
		step: function() {
			return this.get('step');
		},
		setStep: function(s) {
			if((s >= 1 && s <= 3) && (this.step() != s)){
				if (s > this.get('max_step')) this.set('max_step', s, {silent: true});
				this.set('step',s);
			}
		},
		orderId: function(){
			return this.get('order_id');
		},
		setOrderId: function(id){
			this.set('order_id', id);
		},
		quantity: function(){
			return this.get('quantity');
		},
		increaseQuantity: function(){
			var q = this.quantity();
			q += 1;
			if (q > 3) q = 3;
			this.set('quantity', q);
		},
		decreaseQuantity: function(){
			var q = this.quantity();
			q -= 1;
			if (q < 1 ) q = 1;
			this.set('quantity', q);
		},
		quantityText: function(){
      return this.quantity() == 1 ? "loaf" : "loaves";
		},
		updateComponent: function(c){
			var components = this.get("components");
			components[c] = !components[c];
			this.trigger("change");
		},
    saveOrder: function() {
      //$.post("/orders", {quantity: model.quantity, is_delivery: delivery_type == 'delivery', })	
      //curl -d "txn_id=2H507847F71659449&order_id=1&payment_status=Completed" http://localhost:3000/payment_notifications
      //<input type="hidden" name="notify_url" value=<%= payment_notifications_url%>> 
      var model = this;
      //_.extend(model.attributes, {components_json: model.get("components").toJSON()});
      $.ajax({url: "/orders", 
        data: this.attributes,
        type: 'POST',
        dataType: 'json',
        success: function(data) { 
          //alert("Success!"); 
          model.setStep(3); 
          model.setOrderId(data.order_id);
          model.setPaypalEncrypted(data.paypal_encrypted_str);
        },
        error: function (xhr, status) { alert('Sorry, there was a problem!'); }
      });
    },
		orderText: function() {
			var componentText = '',
			    componentName = function(comp_name) {
			        return "<span class='selected-component'>" + comp_name + "</span>"
			    };

			var selected_elements = _.reduce(this.get("components"), function(components, isSelected, name) {
			    if(isSelected) { components.push(name); }
			    return components;
			}, []);
			
			if(selected_elements.length > 0) {
				componentText = componentName(selected_elements[selected_elements.length-1]);

				//b and c
				//a, b and c
				var second_last_component = selected_elements.length-2;
				for(var i = second_last_component; i >= 0; i--){
					if(i == second_last_component){
						componentText = componentName(selected_elements[i]) + " and " + componentText;
					} else {
						componentText = componentName(selected_elements[i]) + ", " + componentText;
					}
				}

				componentText = " with " + componentText;
			}
			return componentText;
		},
		deliveryAddress: function(){
			return this.get('delivery_address');
		},
		setDeliveryAddress: function(address){
			this.set('delivery_address', address, {silent: true});
		},
		deliveryType: function(){
			return this.get('delivery_type');
		},
		setDeliveryType: function(d_type){
			if (!d_type) return;
			this.set('delivery_type', d_type, {silent: true});
		},
		deliveryDistance: function(){
			return this.get('delivery_distance');
		},
		setDeliveryDistance: function(dist){
			this.set('delivery_distance', dist, {silent: true});
		}, 
		setPaypalEncrypted: function(s){
			this.set('paypal_encrypted', s);
		},
		setUserName: function(s){
			this.set('user_name', s, {silent: true});
		},
		setUserEmail: function(s){
			this.set('user_email', s, {silent: true});
		},
		setUserComment: function(s){
			this.set('user_comment', s, {silent: true});
		},
		setUserPhone: function(s){
			this.set('user_phone', s, {silent: true});
		},
		isNameValid: function(){
			var txt = "";
			if (this.get("user_name") ===""){
				txt = "Please enter your name";
				//set name bit
			}
			//else{
				//clear name bit
				//return "";
			//}
			this.setErrorMessage("user-name", txt);
			return txt === "";
		},
		isEmailValid: function(){
			var txt = "";
			var email = this.get("user_email");
			if (email ===""){
				txt = "Email cannot be blank";
			}else{
				var regex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+/;
				if (!regex.test(email)){
					txt =  "Email is invalid";
				}
			}
			this.setErrorMessage("user-email", txt);
			return txt === "";
		},
    isPhoneValid: function(){
      var txt = "";
      var phone = this.get("user_phone");
        if (phone === ""){
          txt = "Please enter your phone number";
        }else{
          regex = /[0-9\-\+ ]/;
          if (!regex.test(phone)){
            txt = "Phone is invalid";
          }
        }
      this.setErrorMessage("user-phone", txt);
      return txt === "";
    },
    isAddressValid: function(){
      var txt = "";
      if (this.get("delivery_type") !== "pickup"){
        if (this.get("delivery_address") === ""){
          txt = "Please enter delivery address";
        }else if (this.get("delivery_distance") > 4500){
          txt = "Distance to your place is " + Math.round((+this.get("delivery_distance"))/1000) + "km. Please select our pick up option.";
        }
      }
      this.setErrorMessage("delivery-address", txt);
      return txt === "";
    },
		setErrorMessage: function(field_name, txt){
			var vf = this.get("form_fields_errors");
			vf[field_name] = txt;
			this.set("form_fields_errors", vf, {silent: true});
		},
		isOrderValid: function(){
			var name_valid = this.isNameValid();
			var email_valid = this.isEmailValid();
			var phone_valid = this.isPhoneValid();
			var address_valid = this.isAddressValid();
			
			return name_valid && email_valid && phone_valid && address_valid;
		},
    loafPrice: function(){
      return this.get('loaf_price');
    },
    deliveryPrice: function(){
      return this.get('delivery_price');
    }
	});

	bread.OrderView = Backbone.View.extend({
		tagName: "div",

		el: $("#order-wizard"),

		initialize: function() {
			this.model.on('change', this.render, this);
			//this.model.on('change:is_form_valid', this.setReviewButton);
			this.render();
		},
		breadCrumbsTemplate: 	_.template($('#bread-crumbs-template').html()),
		selectTemplate: 		_.template($('#select-template').html()),
		paymentTemplate: 		_.template($('#payment-template').html()),
		reviewTemplate:			_.template($('#review-template').html()),
		render: function() {
			var json = this.model.toJSON();
			_.extend(json, {
			    loaf: this.model.quantityText(),
			    order_text: this.model.orderText(),
			    availableComponents: this.model.availableComponents
			});
			var stepTemplate = null;
			
			switch(this.model.step()) {
				case 1:
					stepTemplate = this.selectTemplate(json);
					break;
				case 2:
					stepTemplate = this.paymentTemplate(json);
					break;
				case 3:
					stepTemplate = this.reviewTemplate(json);
					break;
			}
			
			$(this.el).html(this.breadCrumbsTemplate(json));
			$(this.el).append(stepTemplate);
			
			this.initializeMapIfExists();
			this.placeDeliveryMarker();
			this.updateDeliveryView();
		},
		
		events: {
			"click #bread-crumbs span": "breadCrumbsHandler",
			"click #quantity-plus": "plusButtonHandler",
			"click #quantity-minus": "minusButtonHandler",
			"click .component-image": "componentImageHandler",
			"click #step-button": "stepButtonHandler",
			"change input:radio": "deliveryTypeHandler",
			"keyup #delivery-address": "addressChangeHandler",
			"blur #user-name": "userNameChangeHandler",
			"blur #user-email": "userEmailChangeHandler",
			"blur #user-comment": "userCommentChangeHandler", 
			"blur #user-phone": "userPhoneChangeHandler" 
		},
		isPickup: function(){
			return this.model.deliveryType() == "pickup";
		},
		deliveryTypeHandler: function(event){
			this.model.setDeliveryType($(event.target).val());
			this.updateDeliveryView();
		},
    updateDeliveryView: function(){
      if(this.model.step() != 2) return;
      //$("#user-name").focus();
      
      var delivery_address = $("#delivery-address");
      var delivery_price = $("#delivery-price");
      var total = this.model.loafPrice() * this.model.quantity();
      delivery_address.toggleClass("disabled");
      var delivery_message;
      if ( this.isPickup() ){
        delivery_price.hide();
        delivery_address.attr("disabled", "disabled");
        
        this.home.circle.setMap(null);
        this.deliveryMarker.setMap(null);
        delivery_message = "You can pick up your bread on Saturday from 9am to 1pm";
      }else{
        delivery_price.show();
        delivery_address.removeAttr("disabled");
        total += this.model.deliveryPrice();
        
        this.home.circle.setMap(this.map);
        this.deliveryMarker.setMap(this.map);
        delivery_message = "I'll bike your order to your location on Saturday from 2pm to 7pm";
      }
      $("#total").text(" $"+total);
      $("#delivery-message").text(delivery_message);
    },
    breadCrumbsHandler: function(event){
      var crumb = $(event.target);
      if (crumb.hasClass('enabled') && !crumb.hasClass('active')){
        var step = this.extractStepFromString(crumb.text());
        if (this.model.step() === 2 && step ===3){
          this.step2Action();
        }else{
          this.clearPopovers();
          this.model.setStep(step);
        }
      }
    },
		plusButtonHandler: function(){
			this.model.increaseQuantity();
		},
		minusButtonHandler: function(){
			this.model.decreaseQuantity();
		},
		componentImageHandler: function(event){
			var component = $(event.target).attr("alt");
			this.model.updateComponent(component);
		},
		clearPopovers: function(){
		  _.each(this.model.attributes.form_fields_errors, function(error_message, field_name){
          var fld = $("#"+field_name);
          fld.popover("hide");
      });
    },
    step2Action: function(){
      if (this.model.isOrderValid()){
        this.clearPopovers();
        this.model.saveOrder();
      }else{
        var popoverOptions={
          placement: "right",
          trigger: "manual",
        }
        _.each(this.model.attributes.form_fields_errors, function(error_message, field_name){
          var fld = $("#"+field_name);
          fld.popover(popoverOptions);
          if (error_message !== ""){
            fld.data("popover").options.content = error_message;
            fld.popover("show");
            fld.parent().parent().addClass("error");
          }else{
            fld.popover("hide");
            fld.parent().parent().removeClass("error");
          }
        })
      }
    },
    stepButtonHandler: function(){
      if (this.model.step() == 2){
        this.step2Action();
      }else{
        this.clearPopovers();
        this.model.setStep(this.model.step()+1);
      }
    },
    extractStepFromString: function(str){
      //return +str.substring(str.length-1);
      return +str.substring(0,1);
    },
    initializeMapIfExists: function(){
			var map_div = $('#map-canvas')[0];
			if (!map_div) return;
			//this.myAddress = "51 lower simcoe, toronto, on";
			//create map
			var myLatLng = new google.maps.LatLng(43.64225,-79.383591);
			var options = {
				center: myLatLng,
				zoom: 12,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			this.map = new google.maps.Map(map_div, options);
			
			//create home marker
			this.home = new Object;
			this.home.marker  = new google.maps.Marker({
				map: this.map,
				position: myLatLng
			});
			
			var circleParams = {
//				map: this.map,
				radius: 4000,
				fillColor: '#0000FF', 
				strokeColor: '#0011FF',
				strokeWeight: 0.5,
				center: myLatLng
			};
			
			this.home.circle = new google.maps.Circle(circleParams);
			
			//create delivery marker
			if (!this.deliveryMarker) this.deliveryMarker = new google.maps.Marker({});
			if (!this.distanceService) this.distanceService = new google.maps.DistanceMatrixService();
			
		},
    placeDeliveryMarker: function(){
			if ( this.isPickup() ) return;
			var address = $('#delivery-address').val();
			if(!address) return;
			this.model.setDeliveryAddress(address);
			address += ' toronto ontario canada';
			
			if(!this.geocoder) this.geocoder = new google.maps.Geocoder();
			$('delivery-message-error').val('');
			
			var model = this.model;
			var map = this.map;
			var deliveryMarker = this.deliveryMarker;
			var homeMarker = this.home.marker;
			var distanceService = this.distanceService;
			this.geocoder.geocode({'address': address}, function(results, status){
				if (status == google.maps.GeocoderStatus.OK){
					//bounds.extend(results[0].geometry.location);
					//map.fitBounds(bounds);
					deliveryMarker.setPosition(results[0].geometry.location);
					deliveryMarker.setMap(map);
					
					distanceService.getDistanceMatrix({
						origins: [homeMarker.getPosition()],
						destinations: [deliveryMarker.getPosition()],
						travelMode: google.maps.TravelMode.DRIVING,
						avoidHighways: true,
						avoidTolls: true
					}, function(response, status){
						if (status == google.maps.DistanceMatrixStatus.OK){
							var origins = response.originAddresses;
							var destinations = response.destinationAddresses;
							for (var i=0; i< origins.length; i++){
								var rows = response.rows[i];
								for (var j=0; j<destinations.length; j++)
								{
									var element = rows.elements[j];
									if (element.status == google.maps.DistanceMatrixStatus.OK){
										$("#distance-message").text("Distance:" + element.distance.text);
										model.setDeliveryDistance(element.distance.value);
									}
								}
							}
						}
					});
				}
			});
		},
    addressChangeHandler: function(){
			//stop timer
			if(this.inputTimer){
				clearTimeout(this.inputTimer)
				this.inputTimer = null;
			} 
			
			var view = this;
			var timerCallback = function(){
				view.placeDeliveryMarker();
			}
			
			this.inputTimer = setTimeout(timerCallback, 1000);
		},
    userNameChangeHandler: function(){
      this.model.setUserName($("#user-name").val());
		},
		userEmailChangeHandler: function(){
			this.model.setUserEmail($("#user-email").val());
		},
		userCommentChangeHandler: function(){
			this.model.setUserComment($("#user-comment").val());
		},
		userPhoneChangeHandler: function(){
			this.model.setUserPhone($("#user-phone").val());
		},
	});
};