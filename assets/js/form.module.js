
import * as share from './share.module.js';
import * as map from './map.module.js';
import * as details from './details.module.js';

// Define constants
const DATA_API = "https://static.wallonia.ml/file/wallonia-lidar"

let dict_postalCodes, list_postalCodes, postalCode,
    dict_streetNames, list_streetNames, streetId,
    dict_houseNumbers, list_houseNumbers, houseId;

let ref_streetNames = [list_streetNames]
let ref_houseNumbers = [list_houseNumbers]

// Link html document
const input_PostalCode = document.getElementById('inputPostalCode')
const input_StreetName = document.getElementById('inputStreetName')
const input_HouseNumber = document.getElementById('inputHouseNumber')

const button_submit = document.getElementById('button-submit')
const canvas_placeholder = document.getElementById('canvas-placeholder')
const canvas_wrapper = document.getElementById('canvas-wrapper');


let init = (callback) => {

    // Fetch the Postal code list
    fetchJSON('/web/postal_codes.json', (result) => {

        dict_postalCodes = result
        list_postalCodes = Object.keys(result)

        // Append the list to the form
        appendDataList(list_postalCodes, 'datalist-postal-code')
    })


    // Postal Code event listener
    input_PostalCode.addEventListener('input',
        () => {onInput(input_PostalCode, list_postalCodes, (result) => {

            if (result) {

                // Save the chosen postal code
                postalCode = dict_postalCodes[result]

                // Reset the house number datalist
                dict_streetNames = undefined
                list_streetNames = undefined
                clearDataList('datalist-street-names')

                // Fetch the street name file
                fetchJSON('/web/' + postalCode + '.json', (result) => {
                    dict_streetNames = result
                    list_streetNames = Object.keys(result)
                    ref_streetNames[0] = list_streetNames

                    // Append the list to the form
                    appendDataList(list_streetNames, 'datalist-street-names')
                })
            }
        })
    });
    enableOnValidation(input_PostalCode, input_StreetName, ref_streetNames)

    // Street Name event listener
    input_StreetName.addEventListener('input',
        () => {onInput(input_StreetName, list_streetNames, (result) => {

            if (result) {

                // Save the chosen street name
                streetId = dict_streetNames[result]

                // Reset the house number datalist
                dict_houseNumbers = undefined
                list_houseNumbers = undefined
                clearDataList('datalist-house-numbers')

                // Fetch the house number file
                fetchJSON('/web/' + postalCode + '/' + streetId + '.json', (result) => {
                    dict_houseNumbers = result
                    list_houseNumbers = Object.keys(result)
                    ref_houseNumbers[0] = list_houseNumbers

                    // Append the list to the form
                    appendDataList(list_houseNumbers, 'datalist-house-numbers')
                })
            }
        })
    });
    enableOnValidation(input_StreetName, input_HouseNumber, ref_houseNumbers)

    // House Number event listener
    input_HouseNumber.addEventListener('input',
        () => {onInput(input_HouseNumber, list_houseNumbers, (result) => {

            if (result) {

                // Save the chosen house number
                houseId = dict_houseNumbers[result]
                button_submit.disabled = false
            }
        })
    });

    // Submit button event listener
    button_submit.addEventListener("click",
        () => {

            // Hide the share, map and details tab
            share.hideShareData()
            map.lockMap()
            details.lockDetails()

            // Lock the form
            lockForm()

            // Render the house
            callback(houseId)
        })
}

let fetchJSON = (url, callback) => {
    /*
    Fetch the postal code list from the data API, and return it as a callback.
     */

    fetch(DATA_API + url).then((response) => {
        return response.json()

    }).then((json) => {
        callback(json)
    })
}

let appendDataList = (list, dataListId) => {
    /*
    Append the given list to a given datalist (form).
     */

    const dataList = document.getElementById(dataListId);

    list.forEach((entry) => {
        let option = document.createElement('option');
        option.value = entry;
        dataList.appendChild(option);
    });
}

let clearDataList = (dataListId) => {
    /*
    Remove all element of a given datalist.
     */

    document.getElementById(dataListId).innerHTML = '';
}

let validate = (inputElement, list) => {
    /*
    Validate a given input with a given list.
     */

    if (list.includes(inputElement.value)) {

        // Display 'is valid'
        inputElement.classList.remove('is-invalid')
        inputElement.classList.add('is-valid')
        return true

    } else {

        // Display 'is invalid'
        inputElement.classList.remove('is-valid')
        inputElement.classList.add('is-invalid')
        return false;
    }
}

let enableOnValidation = (toValidate, toToggle, toToggleData) => {
    /*
    Enable a given 'toToggle' input if the 'toValidate' input is valid.
     */

    new MutationObserver(() => {

        // Check every 50ms if the data for the toToggle input was fetched.
        const interval = setInterval(() => {

            if (toToggleData[0] === undefined) {
                return
            }

            else {
                clearInterval(interval);

                if (toValidate.classList.contains('is-valid')) {
                    toToggle.disabled = false

                } else if (toValidate.classList.contains('is-invalid')) {
                    toToggle.disabled = true
                }
            }
            }, 10);

    }).observe(toValidate, {attributes: true})
}


let onInput = (element, list, callback) => {
    /*
    This function is automatically trigger the validation when a user
    finish to write in an input. Return the value of the input if it
    was validated.
     */

    const duration = 150;
    clearTimeout(element._timer);

    // Trigger the validation after 1 second of user's inactivity.
    element._timer = setTimeout(() => {

        if (validate(element, list)) {
            callback(element.value)
        } else {
            callback(false)
        }

        }, duration);
}

let lockForm = () => {

    input_PostalCode.disabled = true
    input_StreetName.readOnly = true
    input_HouseNumber.readOnly = true

    // Disable the search button
    button_submit.disabled = true

    // Show the loading placeholder
    canvas_placeholder.style.display = 'flex'
    canvas_placeholder.classList.add('canvas-loading')

    // Hide the canvas
    canvas_wrapper.style.visibility = 'hidden'
}

let unlockForm = () => {

    input_PostalCode.disabled = false
    input_StreetName.readOnly = false
    input_HouseNumber.readOnly = false

    // Enable the search button
    button_submit.disabled = false

    // Hide the loading placeholder
    canvas_placeholder.style.display = 'none'
    canvas_placeholder.classList.remove('canvas-loading')

    // Display the canvas
    canvas_wrapper.style.visibility = 'unset'
}

export {init, lockForm, unlockForm};