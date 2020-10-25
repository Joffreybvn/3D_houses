
import * as renderer from './renderer.module.js';

const details_tab = document.getElementById('details-tab')

// Area fields
const area_land = document.getElementById('area-land')
const area_house = document.getElementById('area-house')

// Buttons
const button_landMesh = document.getElementById('button-landMesh')
const button_landLines = document.getElementById('button-landLines')
const button_vegetation = document.getElementById('button-vegetation')
const button_house = document.getElementById('button-house')

// Init default displaying state
let state_landMesh;
let state_landLines;
let state_vegetation;
let state_house;

let init = () => {

    // Show/Hide the land mesh
    button_landMesh.addEventListener('click', () => {

        // Invert the display state
        state_landMesh = !state_landMesh
        renderer.displayLand(state_landMesh)
    })

    // Show/Hide the land lines
    button_landLines.addEventListener('click', () => {

        // Invert the display state
        state_landLines = !state_landLines
        renderer.displayLandLines(state_landLines)
    })

    // Show/Hide the vegetation
    button_vegetation.addEventListener('click', () => {

        // Invert the display state
        state_vegetation = !state_vegetation
        renderer.displayVegetation(state_vegetation)
    })

    // Show/Hide the house
    button_house.addEventListener('click', () => {

        // Invert the display state
        state_house = !state_house
        renderer.displayHouse(state_house)
    })
}

let resetCheckBoxes = () => {

    // Reset land mesh
    state_landMesh = true;
    button_landMesh.checked = true

    // Reset land lines
    state_landLines = true;
    button_landLines.checked = true

    // Reset vegetation
    state_vegetation = true;
    button_vegetation.checked = true

    // Reset house
    state_house = true;
    button_house.checked = true
}

let addDetails = (details) => {

    // Append data to the details card
    area_land.innerText =  Math.trunc(details.area_property) + ' m²'
    area_house.innerText =  Math.trunc(details.area_building) + ' m²'

    // Unlock the details tab
    details_tab.classList.remove('disabled')
}

let lockDetails = () => {

    // Lock the details tab
    details_tab.classList.add('disabled')
}

export {init, addDetails, resetCheckBoxes, lockDetails};