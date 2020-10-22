
let onPageLoad = (callback) => {
    /*
    Detect if the opened webpage come from a shared link.
    Return a callback (error, response).
     */

    // Get the parameters stored in the URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

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

let hasHouseIdParameter = (urlParams) => {
    /*
    Return true if the urlParams has a houseId parameter.
     */
    return !!urlParams.has('id');
}

export {onPageLoad};