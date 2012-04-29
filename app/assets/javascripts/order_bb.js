// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/


bread.initOrderBackbone = function(){
	
	var componentsArray = [];
	
	bread.OrderModel = Backbone.Model.extend({
		defaults: {
			quantity: 1,
			components: {},
			step: 1,
			max_step: 1,
			delivery_type: 'pickup',	//1 - pickup, 2 - delivery
			delivery_address: ''
		},
		initialize: function(obj){
		},
		step: function() {
			return this.get('step');
		},
		setStep: function(s) {
			if((s >= 1 && s <= 3) && (this.step() != s)){
				if (s > this.get('max_step')) this.set('max_step', s, {silent: true});
				this.set('step',s);
			}
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
		setComponents: function(cs){
			var components = {};
			for(var i=0; i < cs.length; i++) components[cs[i]] = false;
			this.set('components', components);
			componentsArray = cs;
		},
		updateComponent: function(c){
			var components = this.get('components');
			components[c] = !components[c];
			this.trigger("change");
		},
		orderText: function(){
			var component_text = '';
			var componentsHash = this.get('components');
			
			var selected_elements = [];
			for(var i=0; i < componentsArray.length; i++){
				if(componentsHash[componentsArray[i]]) selected_elements.push(componentsArray[i]);
			}
			
			
			if(selected_elements.length > 0){
				component_text = componentName(selected_elements[selected_elements.length-1]);

				//b and c
				//a, b and c
				var second_last_component = selected_elements.length-2;
				for(var i = second_last_component; i >= 0; i--){
					if(i == second_last_component){
						component_text = componentName(selected_elements[i]) + " and " + component_text;
					} else {
						component_text = componentName(selected_elements[i]) + ", " + component_text;
					}
				}

				component_text = " with " + component_text;
			}
			return component_text;

			function componentName(comp_name){
				return "<span class='selected-component'>" + comp_name + "</span>";
			}
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
		}
	});
	
	bread.OrderView = Backbone.View.extend({
		tagName: "div",

		// className: "order",

		initialize: function() {
			this.model.on('change', this.render, this);

		},
		breadCrumbsTemplate: 	_.template($('#bread-crumbs-template').html()),
		selectTemplate: 		_.template($('#select-template').html()),
		paymentTemplate: 		_.template($('#payment-template').html()),
		render: function( event ){
			//console.log('render');
			var model = this.model;
			var json = model.toJSON();
			json.loaf = model.quantityText();
			json.order_text = model.orderText();
			var stepTemplate = null;
			switch(model.step()){
				case 1:
					stepTemplate = this.selectTemplate( json );
					break;
				case 2:
					stepTemplate = this.paymentTemplate( json );
					break;
			}
			
			$(this.el).html(this.breadCrumbsTemplate(json));
			$(this.el).append(stepTemplate);
			
			this.initializeMapIfExists();
			this.placeDeliveryMarker();
			this.updateDeliveryView();
			return this;
		},
		
		events: {
			"click #bread-crumbs span": "breadCrumbsHandler",
			"click #quantity-plus": 	"plusButtonHandler",
			"click #quantity-minus": 	"minusButtonHandler",
			"click .component-image": 	"componentImageHandler",
			"click #step-button": 		"stepButtonHandler",
			"change form input:radio":	"deliveryTypeHandler",
			"keyup #delivery-address":	"addressChangeHandler"
			
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
			var delivery_address = $("#delivery-address");
			if ( this.isPickup() ){
				delivery_address.hide("slow");
				this.home.circle.setMap(null);
				this.deliveryMarker.setMap(null);
				console.log(this.deliveryMarker.getPosition());
			}else{
				delivery_address.show("slow");
				this.home.circle.setMap(this.map);
				this.deliveryMarker.setMap(this.map);
			}
			
		},
		breadCrumbsHandler: function(event){
			var crumb = $(event.target);
			if (crumb.hasClass('enabled') && !crumb.hasClass('active')){
				var step = this.extractStepFromString(crumb.text());
				this.model.setStep(step);
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
		stepButtonHandler: function(){
			this.model.setStep(this.model.step()+1);
		},
		extractStepFromString: function(str){
			return +str.substring(str.length-1);
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
			
			//circle.bindTo('center', marker, 'position');
			
			
			
			//this.addMarker(this.myAddress, false, false);
		},
		placeDeliveryMarker: function(){
			if ( this.isPickup() ) return;
			var address = $('#street-address').val();
			if(!address) return;
			this.model.setDeliveryAddress(address);
			address += ' toronto ontario canada';
			
			
			if(!this.geocoder) this.geocoder = new google.maps.Geocoder();
			
			var map = this.map;
			var deliveryMarker = this.deliveryMarker;
			this.geocoder.geocode({'address': address}, function(results, status){
				if (status == google.maps.GeocoderStatus.OK){
					//bounds.extend(results[0].geometry.location);
					//map.fitBounds(bounds);
					deliveryMarker.setPosition(results[0].geometry.location);
					deliveryMarker.setMap(map);
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
		}
		
	});

	
}