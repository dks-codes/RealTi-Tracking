const socket = io(); // initialize socket.io - sends a connectin request to backend

if (navigator.geolocation) {
  // check if windows' object naviagtor has geolocation feature
  navigator.geolocation.watchPosition(
    // watches the position
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude }); // location  emmitted from front-end to backend
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000, // to check location again after how much time
      maximumAge: 0, // No Caching
    }
  );
}

// L.map : Asks for location permission
// setView : [0,0] coordinates set to center ; 15 = zoom level
const map = L.map("map").setView([0, 0], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "@DKS",
}).addTo(map); // addTo - adding tileLayer to map

// Create empty object marker
const markers = {}

// Now, Receive the location from backend
socket.on("receive-location", (data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude]);

    // If id is already present (existing user, update marker)
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    }
    // If id not present (New User), add id to markers object and to map.
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
})

socket.on("disconnect", (id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})