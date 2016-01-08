//get access to submit button and add event listener on click
var submit = document.getElementById('submit');
submit.addEventListener('click', getApi, false);

//initiate the map with the center of Los Angeles
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 34.052235, lng: -118.243683},
    scrollwheel: false
  });
  var geocoder = new google.maps.Geocoder();
  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map);
  });
}

//defined geocode function
function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('location').value;
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      resultsMap.setCenter(results[0].geometry.location);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function getApi(e) {
  e.preventDefault();
  //get search box values
  var find = document.getElementById('find').value;
  var location = document.getElementById('location').value;
  var radius = document.getElementById('radius').value || '4828.03';
  var sort = document.getElementById('sort').value || '0';

  //clear previous search results 
  while (result.firstChild) {
    result.removeChild(result.firstChild);
  }

  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (xhr.status === 200) {
      //parsed the response text and got access to the businesses
      var response = JSON.parse(xhr.responseText);
      var name = response.businesses;
      console.log(response);
      //geocoded the location that is entered to become the new center of the map
      var geocoder = new google.maps.Geocoder();
      var address = document.getElementById('location').value;
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: 34.052235, lng: -118.243683},
        scrollwheel: false
      });
      geocodeAddress(geocoder,map);

      //loop through all names in the yelp array
      for (i = 0; i < name.length; i++){
        var result = document.getElementById('result');
        var item = document.createElement('li');
        var title = document.createElement('a');
        var paragraph = document.createElement('p');
        var image = document.createElement('img');
        image.setAttribute('src', name[i].rating_img_url);
        image.setAttribute('class', 'rating');
        //add yelp link to h4 title
        title.setAttribute('href', name[i].mobile_url);
        title.setAttribute('id', 'restaurant');
        title.setAttribute('target', '_blank');
        title.textContent = name[i].name;
        
        var addLink = document.createElement('a');
        addLink.setAttribute('id', 'link');
        addLink.textContent = 'Click here to add this restaurant to your list!';
        paragraph.textContent = [' - This location has a rating of ', name[i].rating, ' stars and a review count of ', name[i].review_count, '. Address and phone number: ', name[i].location.address, '. ', name[i].location.city, ', ', name[i].display_phone, '. '].join('');
        paragraph.setAttribute('id', 'locations');

        //link turns gray on click
        addLink.addEventListener('click', function() {
          var link = document.getElementById('link');
          this.setAttribute('class', 'gray');
          this.textContent = 'Looking forward to your visit!';
        }, false);

        //append results to the page
        result.appendChild(item);
        item.appendChild(title);
        item.appendChild(paragraph);
        item.className += "new-li"; 
        title.appendChild(image);
        item.appendChild(addLink);
        
        //get coordinates
        var latitude = name[i].location.coordinate.latitude;
        var longitude = name[i].location.coordinate.longitude;
        var latLong = {lat: latitude, lng: longitude};

        // added letters to markers
        var labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
        var labelIndex = 0;

        //marker images
        var icon1 = "images/icon.png";
        var icon2 = "images/alt-icon.png";
        //drop marker for every business name
        var marker = new google.maps.Marker({
          position: latLong,
          map: map,
          animation: google.maps.Animation.DROP,
          title: name[i].name,
          label: labels[i][labelIndex++ % labels.length],
          icon: icon1
        });

        //highlight marker on mouseover
        google.maps.event.addListener(marker, 'mouseover', function() {
          this.setIcon(icon2);
        });
        google.maps.event.addListener(marker, 'mouseout', function() {
          this.setIcon(icon1);
        });

        // Before self invoking function //mouseover marker to highlight li in results list
        // item.setAttribute('id', 'off');
        // google.maps.event.addListener(marker, 'mouseover', function() {
        //   var item = document.getElementById('off');
        //   item.setAttribute('id', 'highlight');
        //   console.log(item);
        // });
        // google.maps.event.addListener(marker, 'mouseout', function() {
        //   var item = document.getElementById('highlight');
        //   item.setAttribute('id', 'off');
        // });

        // //mouseover li in result list to highlight marker
        // item.addEventListener('mouseover', function() {
        //   marker.setIcon(icon2);
        //   marker.setAnimation(google.maps.Animation.BOUNCE);
        //   console.log(marker.title);
        // }, false);

        // item.addEventListener('mouseout', function() {
        //   marker.setIcon(icon1);
        //   marker.setAnimation(null);
        // }, false);






        //mouseover marker to highlight li in results list
        item.setAttribute('id', 'off');
        google.maps.event.addListener(marker, 'mouseover', (function() {
          var item = document.getElementById('off');
          item.setAttribute('id', 'highlight');
          console.log(item);
        })(););

        google.maps.event.addListener(marker, 'mouseout', (function() {
          var item = document.getElementById('highlight');
          item.setAttribute('id', 'off');
        })(););

        //mouseover li in result list to highlight marker
        item.addEventListener('mouseover', (function() {
          marker.setIcon(icon2);
          marker.setAnimation(google.maps.Animation.BOUNCE);
          console.log(marker.title);
        })();, false);

        item.addEventListener('mouseout', (function() {
          marker.setIcon(icon1);
          marker.setAnimation(null);
        })();, false);






      } //end for loop
    } else {
        alert('Make sure you entered Find and Location values');
      }
  }

  xhr.open('GET', 'http://localhost:8080/yelp-api/' + find + '/' + location + '/' + radius + '/' + sort, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(location);
}
