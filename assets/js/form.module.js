
// Define constants
const DATA_API = "https://data.wallonia.ml/file/wallonia-lidar"

let dict_postalCodes, list_postalCodes, postalCode,
    dict_streetNames, list_streetNames, streetId,
    dict_houseNumbers, list_houseNumbers, houseId;

// Link html document
const input_PostalCode = document.getElementById('inputPostalCode')
const input_StreetName = document.getElementById('inputStreetName')
const input_HouseNumber = document.getElementById('inputHouseNumber')

const button_submit = document.getElementById('button-submit')
const button_loadSpinner = document.getElementById('button-load-spinner')


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

                // Fetch the street name file
                fetchJSON('/web/' + postalCode + '.json', (result) => {
                    dict_streetNames = result
                    list_streetNames = Object.keys(result)

                    // Append the list to the form
                    appendDataList(list_streetNames, 'datalist-street-names')
                })
            }
        })
    });
    enableOnValidation(input_PostalCode, input_StreetName)

    // Street Name event listener
    input_StreetName.addEventListener('input',
        () => {onInput(input_StreetName, list_streetNames, (result) => {

            if (result) {

                // Save the chosen street name
                streetId = dict_streetNames[result]

                // Fetch the house number file
                fetchJSON('/web/' + postalCode + '/' + streetId + '.json', (result) => {
                    dict_houseNumbers = result
                    list_houseNumbers = Object.keys(result)

                    // Append the list to the form
                    appendDataList(list_houseNumbers, 'datalist-house-numbers')
                })
            }
        })
    });
    enableOnValidation(input_StreetName, input_HouseNumber)

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

            // Disable the button and set the load spinner
            button_submit.disabled = true
            button_loadSpinner.classList.remove('hidden')

            // Render the house
            callback(houseId)

            // Reset the submit button
            button_loadSpinner.classList.add('hidden')
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

let enableOnValidation = (element, toToggle) => {
    /*
    Enable a given 'toToggle' input if the 'element' input is valid.
     */

    new MutationObserver(() => {

        if (element.classList.contains('is-valid')) {
            toToggle.disabled = false

        } else if (element.classList.contains('is-invalid')) {
            toToggle.disabled = true
        }

    }).observe(element, {attributes: true})
}


let onInput = (element, list, callback) => {
    /*
    This function is automatically trigger the validation when a user
    finish to write in an input.
     */

    const duration = 300;
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

export {init};