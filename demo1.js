var firebaseConfig = {
    apiKey: "AIzaSyChsuHJ7l1F7jixuJ8T8px91MVIL8YTzWo",
    authDomain: "hackhere-cypher.firebaseapp.com",
    databaseURL: "https://hackhere-cypher.firebaseio.com",
    projectId: "hackhere-cypher",
    storageBucket: "",
    messagingSenderId: "963576647269",
    appId: "1:963576647269:web:5630155b36446d7f"
  };

firebase.initializeApp(firebaseConfig);




var latitude;
var longitude;
var clat;
var clng;
var nlng;
var nlat;
var x;
var clngs;
var nlngs;
var nlats;
  var coords = [{ lat:19.1989, lng:72.9442},
  { lat: 19.1908, lng: 72.9847 },
  { lat: 19.1486, lng: 73.0012 },
  { lat: 19.1054, lng: 72.9969 },
  { lat: 19.0157, lng: 73.0302}];

function addClickEventListenerToMap(map) {
  // add 'tap' listener
  map.addEventListener('tap', function (evt) {
    var coords =  map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
    var minDist = 100000,
    nearest_text = '*None*',
    markerDist,
    // get all objects added to the map
    objects = map.getObjects(),
    len = map.getObjects().length,
    i;
    
  // iterate over objects and calculate distance between them
  for (i = 0; i < len; i += 1) {
    markerDist = objects[i].getGeometry().distance(coords);
    if (markerDist < minDist) {
      minDist = markerDist;
      nearest_text = objects[i].getData();
                
    }
  }
  logEvent('The nearest marker is: ' + nearest_text);
      //window.alert(typeof nearest_text);
     // var nn = parseInt(nearest_text);
      var coords = [{ lat:19.1989, lng:72.9442},
  { lat: 19.1908, lng: 72.9847 },
  { lat: 19.1486, lng: 73.0012 },
  { lat: 19.1054, lng: 72.9969 },
  { lat: 19.0157, lng: 73.0302}];

        nlat = coords[nearest_text - 1].lat;
        nlng = coords[nearest_text - 1].lng;
      var coord = map.screenToGeo(evt.currentPointer.viewportX,
            evt.currentPointer.viewportY);
    logEvent('Clicked at ' + Math.abs(coord.lat.toFixed(4)) +
        ((coord.lat > 0) ? 'N' : 'S') +
        ' ' + Math.abs(coord.lng.toFixed(4)) +
         ((coord.lng > 0) ? 'E' : 'W'));
      clat = Math.abs(coord.lat.toFixed(4));
      clng = Math.abs(coord.lng.toFixed(4));
    
      var idk = firebase.database().ref().child("charge");
        idk.on('value',function(snapshot){
		var d1 = snapshot.val();
            if(d1<=10)
                x = 500;
            else if(d1 <= 20)
                    x = 1000;
            else if(d1 <= 30)
                    x = 1500;
            else if(d1 <= 40)
                    x = 3000;
            else 
                x = 1000;
        })
      map.addObject(new H.map.Circle(
    // The central point of the circle
    {lat:clat, lng:clng},
    // The radius of the circle in meters
    x,
    {
      style: {
        strokeColor: 'rgba(55, 85, 170, 0.6)', // Color of the perimeter
        lineWidth: 2,
        fillColor: 'rgba(0, 128, 0, 0.7)'  // Color of the circle
      }
    }
  ));
  
      clats = clat.toString(10);
      clngs = clng.toString(10);
      nlats = nlat.toString(10);
      nlngs = nlng.toString(10);
      calculateRouteFromAtoB(platform,clats);//,clat,clng,nlat,nlng);
      //bak
      /*map.setCenter(evt.target.getGeometry());
        openBubble(
       evt.target.getGeometry(), evt.target.instruction);
      *///endbak
      //window.alert(latitude);
  }, false);
    
}

function calculateRouteFromAtoB (platform,clats) {
      
  var router = platform.getRoutingService(),
    routeRequestParams = {
      mode: 'fastest;car',
      representation: 'display',
      routeattributes : 'waypoints,summary,shape,legs',
      maneuverattributes: 'direction,action',
      
      waypoint0: clats+','+clngs, // Brandenburg Gate
      waypoint1: nlats+','+nlngs  // Friedrichstraße Railway Station
    };


  router.calculateRoute(
    routeRequestParams,
    onSuccess,
    onError
  );
}

function onSuccess(result) {
  var route = result.response.route[0];
 /*
  * The styling of the route response on the map is entirely under the developer's control.
  * A representitive styling can be found the full JS + HTML code of this example
  * in the functions below:
  */
  addRouteShapeToMap(route);
  addManueversToMap(route);

  addWaypointsToPanel(route.waypoint);
  addManueversToPanel(route);
  addSummaryToPanel(route.summary);
  // ... etc.
}

/**
 * This function will be called if a communication error occurs during the JSON-P request
 * @param  {Object} error  The error message received.
 */
function onError(error) {
  alert('Can\'t reach the remote server');
}


var mapContainer = document.getElementById('map'),
  routeInstructionsContainer = document.getElementById('panel');


/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: "Fey_CXeRziqaKKmhcvzCQFmlA0cmo0EqtztxD9OM28w"
});
var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map
var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map,{
  center: {lat: 19.0812533, lng: 73.1735322},
  zoom: 11,
  pixelRatio: window.devicePixelRatio || 2
});

// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

//bakchodi
var ui = H.ui.UI.createDefault(map, defaultLayers);
var bubble;
function openBubble(position, text){
 if(!bubble){
    bubble =  new H.ui.InfoBubble(
      position,
      // The FO property holds the province name.
      {content: text});
    ui.addBubble(bubble);
  } else {
    bubble.setPosition(position);
    bubble.setContent(text);
    bubble.open();
  }
}


/**
 * Creates a H.map.Polyline from the shape of the route and adds it to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addRouteShapeToMap(route){
  var lineString = new H.geo.LineString(),
    routeShape = route.shape,
    polyline;

  routeShape.forEach(function(point) {
    var parts = point.split(',');
    lineString.pushLatLngAlt(parts[0], parts[1]);
  });

  polyline = new H.map.Polyline(lineString, {
    style: {
      lineWidth: 4,
      strokeColor: 'rgba(0, 128, 255, 0.7)'
    }
  });
  // Add the polyline to the map
  map.addObject(polyline);
  // And zoom to its bounding rectangle
  map.getViewModel().setLookAtData({
    bounds: polyline.getBoundingBox()
  });
}

function addManueversToMap(route){
  var svgMarkup = '<svg width="18" height="18" ' +
    'xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="8" cy="8" r="8" ' +
      'fill="#1b468d" stroke="white" stroke-width="1"  />' +
    '</svg>',
    dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
    group = new  H.map.Group(),
    i,
    j;

  // Add a marker for each maneuver
  for (i = 0;  i < route.leg.length; i += 1) {
    for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
      // Get the next maneuver.
      maneuver = route.leg[i].maneuver[j];
      // Add a marker to the maneuvers group
      var marker =  new H.map.Marker({
        lat: maneuver.position.latitude,
        lng: maneuver.position.longitude} ,
        {icon: dotIcon});
      marker.instruction = maneuver.instruction;
      group.addObject(marker);
    }
  }
map.addObject(group);
}

function addWaypointsToPanel(waypoints){

  var nodeH3 = document.createElement('h3'),
    waypointLabels = [],
    i;


   for (i = 0;  i < waypoints.length; i += 1) {
    waypointLabels.push(waypoints[i].label)
   }

   nodeH3.textContent = waypointLabels.join(' - ');

  routeInstructionsContainer.innerHTML = '';
  routeInstructionsContainer.appendChild(nodeH3);
}

/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addSummaryToPanel(summary){
  var summaryDiv = document.createElement('div'),
   content = '';
   content += '<b>Total distance</b>: ' + summary.distance  + 'm. <br/>';
   content += '<b>Travel Time</b>: ' + summary.travelTime.toMMSS() + ' (in current traffic)';


  summaryDiv.style.fontSize = 'small';
  summaryDiv.style.marginLeft ='5%';
  summaryDiv.style.marginRight ='5%';
  summaryDiv.innerHTML = content;
  routeInstructionsContainer.appendChild(summaryDiv);
}

/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addManueversToPanel(route){



  var nodeOL = document.createElement('ol'),
    i,
    j;

  nodeOL.style.fontSize = 'small';
  nodeOL.style.marginLeft ='5%';
  nodeOL.style.marginRight ='5%';
  nodeOL.className = 'directions';

     // Add a marker for each maneuver
  for (i = 0;  i < route.leg.length; i += 1) {
    for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
      // Get the next maneuver.
      maneuver = route.leg[i].maneuver[j];

      var li = document.createElement('li'),
        spanArrow = document.createElement('span'),
        spanInstruction = document.createElement('span');

      spanArrow.className = 'arrow '  + maneuver.action;
      spanInstruction.innerHTML = maneuver.instruction;
      li.appendChild(spanArrow);
      li.appendChild(spanInstruction);

      nodeOL.appendChild(li);
    }
  }

  routeInstructionsContainer.appendChild(nodeOL);
}


Number.prototype.toMMSS = function () {
  return  Math.floor(this / 60)  +' minutes '+ (this % 60)  + ' seconds.';
}

// Step 4: create custom logging facilities
var logContainer = document.createElement('ul');
logContainer.className ='log';
logContainer.innerHTML = '<li class="log-entry"></li>';
map.getElement().appendChild(logContainer);

// Helper for logging events
function logEvent(str) {
  var entry = document.createElement('li');
  entry.className = 'log-entry';
  entry.textContent = str;
  logContainer.insertBefore(entry, logContainer.firstChild);
}

// Set up five markers.

//window.alert(coords[0].lat);
//var c = parseInt(coords);

//Create the svg mark-up
var svgMarkup = '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">' +
    '<rect stroke="white" fill="#1b468d" x="1" y="1" width="22" height="22" />' +
    '<text x="12" y="18" font-size="12pt" font-family="Arial" font-weight="bold" ' +
    'text-anchor="middle" fill="white">${REPLACE}</text></svg>';

coords.forEach(function (value, index) {
  var myIcon = new H.map.Icon(svgMarkup.replace('${REPLACE}', index + 1)),
  marker = new H.map.Marker(value,  {
    icon: myIcon,
    volatility: true
  });
  // add custom data to the marker
  marker.setData(index + 1);

  // set draggable attribute on the marker so it can recieve drag events
  marker.draggable = true;
  map.addObject(marker);
});


// simple D'n"D implementation for markers"'
map.addEventListener('dragstart', function(ev) {
  var target = ev.target;
  if (target instanceof H.map.Marker) {
    behavior.disable();
  }
}, false);

map.addEventListener('drag', function(ev) {
  var target = ev.target,
      pointer = ev.currentPointer;
  if (target instanceof H.map.Marker) {
    target.setGeometry(map.screenToGeo(pointer.viewportX, pointer.viewportY));
  }
}, false);

map.addEventListener('dragend', function(ev) {
  var target = ev.target;
  if (target instanceof H.map.Marker) {
    behavior.enable();
  }
}, false);






// Add the click event listener.
addClickEventListenerToMap(map);