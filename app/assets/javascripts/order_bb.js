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
			return this;
		},
		
		events: {
			"click #bread-crumbs span": "breadCrumbsHandler",
			"click #quantity-plus": 	"plusButtonHandler",
			"click #quantity-minus": 	"minusButtonHandler",
			"click .component-image": 	"componentImageHandler",
			"click #step-button": 		"stepButtonHandler"
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
		}
		
	});

	
}