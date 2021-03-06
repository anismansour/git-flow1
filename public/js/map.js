console.log("hello");
// let options ={}
let lat = 34.0522;
let lng = -118.2437;

function initMap() {
  //map options

  options = {
    zoom: 13,
    center: {
      lat,
      lng
    }
  };
  //new map
  let map = new google.maps.Map(document.getElementById("map"), options);

  displayHouses(addMarker);

  // displayHousesP(addMarker);
  //FUNCTION  FOR SERVERAL MARKERS WITHOUT HARD CODE to be added in the loop
  function addMarker(props) {
    let marker = new google.maps.Marker({
      position: props.coords,
      map: map
    });

    if (props.content) {
      let infoWindow = new google.maps.InfoWindow({
        content: props.content
      });
      marker.addListener("click", function () {
        infoWindow.open(map, marker);
      });
    }
  }
}

//reinitialize map with filter
function reInitMap() {
  //map options

  // options = {
  //   zoom: 13,
  //   center: { lat, lng }
  // };
  //new map
  let map = new google.maps.Map(document.getElementById("map"), options);
  // displayHouses(addMarker);
  displayHousesP(addMarker);
  //FUNCTION  FOR SEVERAL MARKERS WITHOUT HARD CODE to be added in the loop
  function addMarker(props) {
    let marker = new google.maps.Marker({
      position: props.coords,
      map: map
    });

    if (props.content) {
      let infoWindow = new google.maps.InfoWindow({
        content: props.content
      });
      marker.addListener("click", function () {
        infoWindow.open(map, marker);
      });
    }
  }
}
//script

//script
//call geocode
//geocode();

// get location
let locationForm = document.getElementById("location-form");

locationForm.addEventListener("submit", function (e) {
  e.preventDefault();

  geocode();
});

let longitude;
let latitude;

function geocode() {
  let location = document.getElementById("location-input").value;
  axios
    .get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address: location,
        key: "AIzaSyCTAH_yPmSaWOZnxvuNU157kgFdo0D8kaI"
      }
    })
    .then(function (response) {
      //formated address
      let formattedAddress = response.data.results[0].formatted_address;
      let formattedAddressOutput = `
        <ul class="list-group">
          <li class= "list-group-item">${formattedAddress}</li>
        </ul>
        `;
      //address components
      let addressComponents = response.data.results[0].address_components;
      let addressComponentsOutput = '<ul class="list-group">';
      for (let i = 0; i < addressComponents.length; i++) {
        addressComponentsOutput += `
          <li class="list-group-item">${addressComponents[i].types[0]}:${
          addressComponents[i].long_name
        }</li>
        `;
      }
      //geo
      lat = response.data.results[0].geometry.location.lat;
      lng = response.data.results[0].geometry.location.lng;

      initMap();

      reInitMap();
      // console.log(lat);

      let geometryOutput = `
        <ul class="list-group">
          <li class= "list-group-item"><strong>latitude</strong>:${lat}</li>
          <li class= "list-group-item"><strong>longitude</strong>:${lng}</li>
        </ul>
        `;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function displayHouses(func) {
  let houses = document.querySelectorAll(".house");
  // console.log(houses[0].attributes["1"].value); //address
  // console.log(houses[0].attributes[2].value); // img
  // console.log(houses[0].attributes[3].value); // price 
  // console.log(houses[9].attributes[4].value); // price 
  // console.log(houses[12].attributes[5].value) // type
  for (let i = 0; i < houses.length; i++) {
    locations = houses[i].attributes["1"].value.toString();
    axios
      .get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          address: locations,
          key: "AIzaSyCTAH_yPmSaWOZnxvuNU157kgFdo0D8kaI"
        }
      })
      .then(function (response) {
        //geo
        latitude = response.data.results[0].geometry.location.lat;
        long = response.data.results[0].geometry.location.lng;

        //console.log(latitude);
        // console.log(long);
        // console.log(houses[0].attributes["2"].value);
        func({
          coords: {
            lat: latitude,
            lng: long
          },
          content: `<h1>${houses[i].innerText}</h1> <img id="imgMap" src='${
            houses[0].attributes["2"].value
          }'>`
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  //}
}

function displayHousesP(func) {
  const housesToDisplay = []
  let houses = document.querySelectorAll(".house");
  let price = Number(document.getElementById("maxPrice").value);
  let rooms = Number(document.getElementById("bedroomNb").value);
  let type = document.getElementById("houseType").value.toString();
  console.log("the type var  is " + type);
  console.log("the type on db is " + houses[12].attributes[5].value)
  for (let i = 0; i < houses.length; i++) {
    if (houses[i].attributes[3].value <= price &&
      Number(houses[i].attributes[4].value) === rooms) {
      //   to check house type but  not working need to be added 
      // && houses[i].attributes[5].value === type ||"any"
      // for room type not working 
      //houses[i].attributes[5].value) === type 
      housesToDisplay.push(houses[i])

      locations = houses[i].attributes["1"].value.toString();
      axios
        .get("https://maps.googleapis.com/maps/api/geocode/json", {
          params: {
            address: locations,
            key: "AIzaSyCTAH_yPmSaWOZnxvuNU157kgFdo0D8kaI"
          }
        })
        .then(function (response) {
          //  show object of address
          //console.log(response);
          showHouseTitles(housesToDisplay)

          //geo
          latitude = response.data.results[0].geometry.location.lat;
          long = response.data.results[0].geometry.location.lng;
          //console.log(latitude);
          // console.log(long);
          console.log(houses[0].attributes["3"].value);
          func({
            coords: {
              lat: latitude,
              lng: long
            },
            content: `<h1>${houses[i].innerText}</h1> <img id="imgMap" src='${
              houses[i].attributes["2"].value
            }'>`
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
}

const showHouseTitles = (houses) => {
  houses.forEach(house => house.style.display = "block")
}