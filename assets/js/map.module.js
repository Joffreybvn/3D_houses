
const map_tab = document.getElementById('map-tab')
const map_button = document.getElementById('map-button')

// Location
const house_street = document.getElementById('house-street')
const house_city = document.getElementById('house-city')

let map, layerGroup, openStreetMapURL;

let init = () => {

    // Display the map on tab click
    map_tab.addEventListener('click', () => {
        displayMap()
    })

    // Make the "See on Map" button clickable
    map_button.addEventListener('click', () => {
        window.location.href = openStreetMapURL;
    })

    // Init the map tab
    map = L.map('house-map')
    layerGroup = L.layerGroup().addTo(map);

    // Append the tile server
    L.tileLayer('https://tile.osm.be/osmbe/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.be">OpenStreetMap Belgium</a>'
    }).addTo(map);
}

let unlockMap = (metadata) => {

    // Unlock the map tab
    map_tab.classList.remove('disabled')

    // Set the view to the house and append a marker
    map.setView([metadata.y, metadata.x], 18);
    L.marker([metadata.y, metadata.x]).addTo(layerGroup);

    // Write the location
    house_street.innerText = metadata.street_name + ', ' + metadata.house_number
    house_city.innerText = metadata.postal_code + ' ' + metadata.city_name

    // Edit the OpenStreetMap URL:
    openStreetMapURL = 'https://www.openstreetmap.org/#map=15/' + metadata.y + '/' + metadata.x
}

let lockMap = () => {

    // Disable the map tab
    map_tab.classList.add('disabled')

    // Clean all markers
    layerGroup.clearLayers();
}

let displayMap = () => {

    setTimeout(() => {
        map.invalidateSize();
    }, 200)
}


export {init, unlockMap, displayMap, lockMap};