<!DOCTYPE html>
<html>
	<head>
		<style type="text/css">
		 html { height: 100% }
      	 body { height: 100%; margin: 0; padding: 0 }
      	 #map_canvas { height: 100% }
	     #result{
	     	font-family: Trebuchet;
	     }
	    </style>

		<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false">
		</script>
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
		<script type="text/javascript">
			//key=AIzaSyDhRPSh3X2b3goMp4DcBLd855DGDv1iO48&
			var geocoder;
			var map;
			var bounds = new google.maps.LatLngBounds();

			var markersArray = [];

			$(document).ready(function(){
				var my_address = "228 Queens Quay, Toronto, on"
				var myLatLng = new google.maps.LatLng(43.6395961, -79.3835943);
				$("#my_address").val(my_address);
				$("#their_address").val("10 dundas east, toronto, on");

				geocoder = new google.maps.Geocoder();
				var options = {
					center: myLatLng,
					zoom: 12,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				}

				map = new google.maps.Map(document.getElementById('map_canvas'), options);
				
			});

			function calculateDistances(){
				var dist = new google.maps.DistanceMatrixService();
				// console.log($("#my_address").val());
				dist.getDistanceMatrix({
					origins: [$("#my_address").val()],
					destinations: [$("#their_address").val()],
					travelMode: google.maps.TravelMode.DRIVING,
					avoidHighways:true,
					avoidTolls: true
				}, onDistanceCalculated);

				function onDistanceCalculated(response, status){
					if (status == google.maps.DistanceMatrixStatus.OK){

						var origins = response.originAddresses;
						var destinations = response.destinationAddresses;

						clearOverlays();

						for (var i = 0; i<origins.length; i++){
							addMarker(origins[i], true, true);
							var rows = response.rows[i];
							for(var j = 0; j< destinations.length; j++){
								var element = rows.elements[j];
								if (element.status == google.maps.DistanceMatrixStatus.OK){
									$("#result").text("Distance: "+ element.distance.text);	
									addMarker(destinations[j]);
								}else if (status == google.maps.DistanceMatrixStatus.NOT_FOUND){
									$("#result").text("Could not geocode the destination");	
								}
							}
						}
						// var distance = response.rows[0].elements[0].distance.text;
					}
				}

				function addMarker(location, isBreadIcon, addCircle){
					geocoder.geocode({'address': location}, function(results, status){
						if (status == google.maps.GeocoderStatus.OK){
							bounds.extend(results[0].geometry.location);
							//map.fitBounds(bounds);
							// var breadIcon = isBreadIcon ? 'bread-icon-small.png' : '';
							var breadIcon = null;
							if (isBreadIcon){
								breadIcon = new google.maps.MarkerImage('bread-icon-small.png',
													new google.maps.Size(30,30),
													new google.maps.Point(0,0),
													new google.maps.Point(15,15)
								);
							}
							console.log(location);
							var marker = new google.maps.Marker({
								map: map,
								position: results[0].geometry.location,
								title: location,
								zIndex: 1,
								icon: breadIcon
							});
							markersArray.push(marker);
							if (addCircle){
								var circleParams = {
									map: map,
									radius: 4000,
									fillColor: '#0000FF', 
									strokeColor: '#0011FF',
									strokeWeight: 0.5,
									zIndex: 0
								};
								var circle = new google.maps.Circle(circleParams)
								circle.bindTo('center', marker, 'position');
								markersArray.push(circle);
							}
						}
					});
				}

				function clearOverlays(){
					if (markersArray){
						for (var i = 0; i< markersArray.length; i++){
							markersArray[i].setMap(null);
						}
						markersArray.length = 0;
					}
				}
			}
		</script>
	</head>
	<body>
		<div>
			My address: </label><input type="text" id="my_address"/> <br/>
			Their address: </label><input type="text" id="their_address"/>
		</div>
		<div>
			<button type="button" onclick="calculateDistances()">calculate</button>
		</div>
		<div id="result">
		</div>
		<div id="map_canvas" style="width:400px; height:300px "></div>
	</body>
</html>