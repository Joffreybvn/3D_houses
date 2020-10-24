
const map_tab = document.getElementById('map-tab')
const map_button = document.getElementById('map-button')

// Location
const house_street = document.getElementById('house-street')
const house_city = document.getElementById('house-city')

let map, openStreetMapURL;

let init = () => {

    // Display the map on tab click
    map_tab.addEventListener('click', () => {
        displayMap()
    })

    // Make the "See on Map" button clickable
    map_button.addEventListener('click', () => {
        window.location.href = openStreetMapURL;
    })
}

let unlockMap = (metadata) => {

    // Enable the map tab and append the map
    map_tab.classList.remove('disabled')
    map = L.map('house-map').setView([metadata.y, metadata.x], 18);

    // Append image on the map
    L.tileLayer('https://tile.osm.be/osmbe/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.be">OpenStreetMap Belgium</a>'
    }).addTo(map);

    // Append a marker on the house location
    L.marker([metadata.y, metadata.x]).addTo(map);

    // Write the location
    house_street.innerText = metadata.street_name + ', ' + metadata.house_number
    house_city.innerText = metadata.postal_code + ' ' + metadata.city_name

    // Edit the OpenStreetMap URL:
    openStreetMapURL = 'https://www.openstreetmap.org/#map=15/' + metadata.y + '/' + metadata.x
}

let lockMap = () => {

    // Disable the map tab
    map_tab.classList.add('disabled')
}

let displayMap = () => {

    setTimeout(() => {
        map.invalidateSize();
        console.log('map size reset')
    }, 200)
}


export {init, unlockMap, displayMap, lockMap};