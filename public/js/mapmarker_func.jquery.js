		//set up markers 
		var myMarkers = {"markers": [
				//{"latitude": "51.511732", "longitude":"-0.123270", "icon": "img/map-marker2.png"}
                {"latitude": "48.338453", "longitude":"18.796238", "icon": "img/map-marker1.png"}
			]
		};
     
		//set up map options 
		$("#map").mapmarker({
			zoom	: 12,
			center	: '1587, 935 06 Jabloňovce, Slovakia',
			markers	: myMarkers
		});
	