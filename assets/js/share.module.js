
const card_share = document.getElementById('sharing-card')
const input_share = document.getElementById('sharing-link')
const button_share = document.getElementById('button-sharing-link')

let onPageLoad = (callback) => {
    /*
    Detect if the opened webpage come from a shared link.
    Return a callback (error, response).
     */

    // Get the parameters stored in the URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Add event listener on share input click
    input_share.addEventListener('click', () => {
        focusInputShare()
    })

    // Add event listener on share button click
    button_share.addEventListener('click', () => {

        focusInputShare()
        document.execCommand("copy");
    })

    if (hasHouseIdParameter) {

        // Get the house Id
        const raw_houseId = urlParams.get('id')
        let houseId;

        // Try to convert it to int
        try {
            houseId = parseInt(raw_houseId)
        }

        // Return false if the conversion failed
        catch (err) {
            callback(true, undefined)
        }

        // If the value is a number, return it
        if (!Number.isNaN(houseId)) {
            callback(false, houseId)
        }
    }

    callback(true, undefined)
}

let focusInputShare = () => {

    // Focus and highlight the input content
    input_share.focus();
    input_share.select();
    input_share.setSelectionRange(0, input_share.value.length)
}

let hasHouseIdParameter = (urlParams) => {
    /*
    Return true if the urlParams has a houseId parameter.
     */
    return !!urlParams.has('id');
}

let displayShareData = (houseID) => {

    const url = 'https://wallonia.ml/?id=' + houseID

    // Update the page URL with the houseId
    history.pushState({
        id: 'wallonia-ml'
    }, 'Wallonia.ml - Address', url);

    // Set the sharing link
    input_share.value = url

    // Display the sharing card
    card_share.classList.remove('hidden')
}

let hideShareData = () => {

    // Hide the sharing card
    card_share.classList.add('hidden')
}

export {onPageLoad, displayShareData, hideShareData};