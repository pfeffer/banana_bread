bread.orderStart = function() {
	bread.initOrderBackbone(); //create Backbone Order related model and view
	
	bread.orderModel = new bread.OrderModel;
	new bread.OrderView({ model: bread.orderModel });
	
	//extract avaiable components and set in the model
    // var availableComponents = $(".component-image");
    // var componentsArray = new Array(availableComponents.length);
    // 
    // for(var i=0; i < availableComponents.length; i++){
    //  componentsArray[i] = $(availableComponents[i]).attr('alt');
    // }
    // 
    // bread.orderModel.setComponents(componentsArray); 
};