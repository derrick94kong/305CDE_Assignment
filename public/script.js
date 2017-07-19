	// create the module and name it scotchApp
	var myApp = angular.module('myApp', ['ngRoute']);

	// configure our routes
	myApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'home.html',
				controller  : 'mainController'
			})

			// route for the about page
			.when('/favourite', {
				templateUrl : 'favourite.html',
				controller  : 'favouriteController'
			})

			// route for the contact page
			.when('/detail', {
				templateUrl : 'detail.html',
				controller  : 'detailController'
			})
			
			.otherwise({
			  redirectTo: '/'
			})
	});
	
	myApp.service('Map', function($q) {
    
		    this.init = function() {
		        var options = {
		            center: new google.maps.LatLng(40.7127837, -74.00594130000002),
		        	zoom: 13,
		            disableDefaultUI: true    
		        }
		        this.map = new google.maps.Map(
		            document.getElementById("map"), options
		        );
		        this.places = new google.maps.places.PlacesService(this.map);
		    }
		    
		    this.search = function(str) {
		        var d = $q.defer();
		        this.places.textSearch({query: str}, function(results, status) {
		            if (status == 'OK') {
		                d.resolve(results[0]);
		            }
		            else d.reject(status);
		        });
		        return d.promise;
		    }
		    
		    this.addMarker = function(res) {
		        if(this.marker) this.marker.setMap(null);
		        this.marker = new google.maps.Marker({
		            map: this.map,
		            position: res.geometry.location,
		            animation: google.maps.Animation.DROP
		        });
		        this.map.setCenter(res.geometry.location);
		    }
		    
		});
		
		myApp.controller('newPlaceController', function($scope, $http, Map) {
		    
		    $scope.search = function() {
		        $scope.apiError = false;
		        Map.search($scope.searchPlace)
		        .then(
		            function(res) { // success
		                Map.addMarker(res);
		                var place_name = res.name;
		                var lat = res.geometry.location.lat();
		                var lng = res.geometry.location.lng();
		                
		                var appid = 'key=03c331d13acf420faae105133171507'
				    	var api_search = 'https://api.apixu.com/v1/forecast.json?'
				    	var url = api_search  + appid + '&q=' + lat +',' + lng + '&days=10'
					   
						$http.get(url).then(function(response) {
					        var weather_data = response.data
					        $scope.weathers = weather_data
					        $scope.search_location = weather_data.location.name + ", " + weather_data.location.region + " next 5 days forecast"
				    	})

		            },
		            function(status) { // error
		                $scope.apiError = true;
		                $scope.apiStatus = status;
		            }
		        );
		    }
		    
		    $scope.send = function() {
		    	//favourite the place to database  
		    }
		    
		    Map.init();
		});

	myApp.controller('mainController', function($scope) {
		// create a message to display in our view
		

	});

	myApp.controller('favouriteController', function($scope) {
		//show data favourite by user on database
		
	});



	myApp.controller('detailController', function($scope, $routeParams, $http) {
		var lat = $routeParams.lat
		var lng = $routeParams.lng
		
		var appid = 'key=03c331d13acf420faae105133171507'
    	var api_search = 'https://api.apixu.com/v1/forecast.json?'
    	var url = api_search  + appid + '&q=' + lat +',' + lng + '&days=5'
	   
		$http.get(url).then(function(response) {
	        var review_data = response.data
	        $scope.reviews = review_data
	        $scope.search_location = review_data.location.name + ", " + review_data.location.region + " next 5 days forecast"
    	})
	});