		//set up markers 
		var myMarkers = {"markers": [
				//{"latitude": "51.511732", "longitude":"-0.123270", "icon": "img/map-marker2.png"}
                {"latitude": "48.322747", "longitude":"18.791539", "icon": "img/map-marker2.png"}
			]
		};
		//set up map options 
		$("#map").mapmarker({
			zoom	: 12,
			center	: '1587, 935 06 Jabloňovce, Slovakia',
			markers	: myMarkers
		});
	