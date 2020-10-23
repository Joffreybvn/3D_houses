
const map_tab = document.getElementById('map-tab')

let map;

let init = () => {

    // Display the map on tab click
    map_tab.addEventListener('click', () => {
        displayMap()
    })
}

let unlockMap = () => {

    // Enable the map tab and append the map
    map_tab.classList.remove('disabled')
    map = L.map('house-map').setView([50.411460, 4.444240], 18);

    // Append image on the map
    L.tileLayer('https://tile.osm.be/osmbe/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.be">OpenStreetMap Belgium</a>'
    }).addTo(map);
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