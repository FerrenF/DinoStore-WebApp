import { indexController } from './controller/indexController.js';
import { productController } from './controller/productController.js';
import {debugMessage, searchParamsToJson} from './common.js'

function router() {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    if (path === '/'||path==="/application/"||path==="/application") {
        return indexController()
    } else if (path.startsWith('/products/')) {
        const productId = path.split('/').pop();
        return productController(productId)
    } else {
        return new Promise(function(resolve, reject) {
           resolve('<p>Page not found.</p>')
        })
    }
}

/*
    load_page_into_body
        Creates a virtual DOM and compares it against the active DOM. Updates elements as necessary. Bada bing, bada boom, dynamic loading.
 */
function load_page_into_body(newHTML) {
    // Create a temporary container to parse the new HTML
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = newHTML;

    // Get the current and new page content elements
    const currentContent = document.body;
    const newContent = tempContainer;

    if (!newContent) {
        console.error('Failed to find the target content in the new HTML.');
        return;
    }

    // The assignment wants dynamic updates, but its not acceptable to have the entire page flash for it.
    // So we do this: dynamic updates.
    function updateElements(current, newContent) {
        const currentElements = current.childNodes;
        const newElements = newContent.childNodes;

        // Replace or update elements
        for (let i = 0; i < newElements.length; i++) {
            if (i >= currentElements.length) {
                // New element, append it
                current.appendChild(newElements[i].cloneNode(true));
            } else {
                if (!newElements[i].isEqualNode(currentElements[i])) {
                    if (newElements[i].nodeType === Node.ELEMENT_NODE && currentElements[i].nodeType === Node.ELEMENT_NODE) {
                        if (newElements[i].nodeName === currentElements[i].nodeName) {
                            // Update attributes
                            updateAttributes(currentElements[i], newElements[i]);

                            // Update its content recursively
                            updateElements(currentElements[i], newElements[i]);
                        } else {
                            // Different type of element, replace it
                            current.replaceChild(newElements[i].cloneNode(true), currentElements[i]);
                        }
                    } else if (newElements[i].nodeType === Node.TEXT_NODE && currentElements[i].nodeType === Node.TEXT_NODE) {
                        // Update text content
                        if (newElements[i].textContent !== currentElements[i].textContent) {
                            currentElements[i].textContent = newElements[i].textContent;
                        }
                    } else {
                        // Different type of node, replace it
                        current.replaceChild(newElements[i].cloneNode(true), currentElements[i]);
                    }
                }
            }
        }

        // Remove any extra elements that are not in the new content
        while (currentElements.length > newElements.length) {
            current.removeChild(current.lastChild);
        }
    }

    function updateAttributes(currentElement, newElement) {
        // Get all attributes of the new element
        const newAttributes = newElement.attributes;

        // Set or update attributes on the current element
        for (let i = 0; i < newAttributes.length; i++) {
            const attrName = newAttributes[i].name;
            const attrValue = newAttributes[i].value;
            if (currentElement.getAttribute(attrName) !== attrValue) {
                currentElement.setAttribute(attrName, attrValue);
            }
        }

        // Attribute stripping
        const currentAttributes = currentElement.attributes;
        for (let i = currentAttributes.length - 1; i >= 0; i--) {
            const attrName = currentAttributes[i].name;
            if (!newElement.hasAttribute(attrName)) {
                currentElement.removeAttribute(attrName);
            }
        }

        // Image src updates
        if (newElement.nodeName === 'IMG' && currentElement.nodeName === 'IMG') {
            if (newElement.getAttribute('src') !== currentElement.getAttribute('src')) {
                currentElement.setAttribute('src', newElement.getAttribute('src'));
            }
        }
    }

    // Start updating the content
    updateElements(currentContent, newContent);
}

export function navigateTo(url) {
    history.pushState(null, null, url);
    router().then((contentBody)=>{

        load_page_into_body(contentBody)
    });
}

export function hook_all_href_tags() {
    debugMessage('Attempting to hook clicks to all href tags...', 'INFO');
    document.addEventListener('click', function(event) {
        let target = event.target;
        if (target.tagName.toLowerCase() === 'a') {
            handleLinkClick(event, target);
        } else {
            while (target.parentElement) {
                target = target.parentElement;
                if (target.tagName.toLowerCase() === 'a') {
                    handleLinkClick(event, target);
                    break;
                }
            }
        }
    });
}
function handleLinkClick(event, link) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const href = link.getAttribute('href');
    navigateTo(href);
}

export function hook_all_form_submissions() {
    debugMessage('Attempting to hook all form submissions...', 'INFO');
    document.addEventListener('submit', function(event) {
        let target = event.target;
        if (target.tagName.toLowerCase() === 'form') {
            handleFormSubmit(event, target);
        } else {
            while (target.parentElement) {
                target = target.parentElement;
                if (target.tagName.toLowerCase() === 'form') {
                    handleFormSubmit(event, target);
                    break;
                }
            }
        }
    });
}

function handleFormSubmit(event, form) {
    event.preventDefault();
    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    const url = new URL(form.action);
    navigateTo(url.pathname + '?' + new URLSearchParams(formObject).toString());
}

export function init_router(){

    // Listen for popstate events (back/forward navigation)
   // window.addEventListener('popstate', router);
    let contentR = router().then((result)=>{
        document.getElementById('page-content').innerHTML = result;
        load_page_into_body(result)
    }).catch((e)=>debugMessage('Error loading router: '+e.message,'ERROR'));
}
