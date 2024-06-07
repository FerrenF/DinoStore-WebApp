export const APP_PORT = 3050
export const API_PORT = 3051

export function debugMessage(message, level){
    console.log(message)
}

export function graceful_shutdown(code, message){

}

function searchParamsToJson(searchParams) {
    const params = {};
    for (const [key, value] of searchParams.entries()) {
        params[key] = value;
    }
    return params;
}

export function appendPortToCurrentLocation(port) {
    const currentLocation = window.location;
    const protocol = currentLocation.protocol;
    const hostname = currentLocation.hostname;
    const pathname = currentLocation.pathname;
    const hash = currentLocation.hash;

    // Construct the new URL without the search (query parameters)
    return `${protocol}//${hostname}:${port}${pathname}${hash}`;
}

export function apiRequest(endpoint, method = 'GET', params = null) {

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const baseUrl = appendPortToCurrentLocation(API_PORT); // replace with your actual API base URL and port
        let url = `${baseUrl}${endpoint}`;

        if (params && method === 'GET') {
            const queryString = new URLSearchParams(params).toString();
            url += `?${queryString}`;
        }

        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const jsonResponse = JSON.parse(xhr.responseText);

                        resolve(jsonResponse);
                    } catch (error) {
                        reject(new Error(`Error parsing response JSON: ${error.message}`));
                    }
                } else {
                    reject(new Error(`Request failed with status ${xhr.status}: ${xhr.statusText}`));
                }
            }
        };

        xhr.ontimeout = function () {
            reject(new Error(`Request to ${endpoint} timed out`));
        };

        xhr.onerror = function () {
            reject(new Error(`Error during the request to ${endpoint}`));
        };

        // Send the request
        if (params && method !== 'GET') {
            xhr.send(JSON.stringify(params));
        } else {
            xhr.send();
        }
    });
}
