
// Define constants
const DATA_API = "https://data.wallonia.ml/file/wallonia-lidar"

let postalCodes;

// Link html document
let input_PostalCode = document.getElementById('inputPostalCode')
let input_StreetName = document.getElementById('inputStreetName')


let init = () => {

    // Fetch the Postal code list
    fetchPostalCodes((result) => {
        postalCodes = result

        // Append the list to the form
        appendDataList(postalCodes, 'datalist-postal-code')
    })
}

let fetchPostalCodes = (callback) => {
    /*
    Fetch the postal code list from the data API, and return it as a callback.
     */

    fetch(DATA_API + '/web/postal_codes.json').then((response) => {
        return response.json()

    }).then((json) => {
        callback(json['postal_codes'])
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

let validate = (list, input) => {
    /*
    Validate a given input with a given list.
     */

    if (list.includes(parseInt(input.value))) {

        // Display 'is valid'
        input.classList.remove('is-invalid')
        input.classList.add('is-valid')
        return true

    } else {

        // Display 'is invalid'
        input.classList.remove('is-valid')
        input.classList.add('is-invalid')

        input.focus();
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


let onInput = (element, list) => {
    /*
    This function is automatically trigger the validation when a user
    finish to write in an input.
     */

    const duration = 1000;
    clearTimeout(element._timer);

    // Trigger the validate function after 1 second of user's inactivity.
    element._timer = setTimeout(() => {
        validate(list, element);
        }, duration);
}

// Start event listeners
input_PostalCode.addEventListener('input', () => {onInput(input_PostalCode, postalCodes)});
enableOnValidation(input_PostalCode, input_StreetName)

export {init};