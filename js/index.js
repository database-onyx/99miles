document.addEventListener('DOMContentLoaded', function () {
    fetch('categories.json')
        .then(response => response.json())
        .then(categories => {
            const dropdownMenus = document.querySelectorAll('.dropdown-menu');

            dropdownMenus.forEach(dropdownMenu => {
                categories.forEach(category => {
                    const anchorElement = document.createElement('a');
                    anchorElement.classList.add('dropdown-item');
                    anchorElement.href = category.href;
                    anchorElement.textContent = category.label;
                    dropdownMenu.appendChild(anchorElement);
                });
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
});

// Store ordered items in an array
let orderedItems = [];

async function fetchMenuData(id, filterType) {
    try {
        const response = await fetch('menu.json');
        const menuData = await response.json();

        // Filter menu data based on id and filterType
        let filteredMenuData;
        if (filterType === 'all') {
            filteredMenuData = menuData.filter(item => item.id === id);
        } else if (filterType === 'veg') {
            filteredMenuData = menuData.filter(item => item.id === id && item.isVeg);
        } else if (filterType === 'nonVeg') {
            filteredMenuData = menuData.filter(item => item.id === id && !item.isVeg);
        } else {
            console.error('Unknown filter type:', filterType);
            return;
        }

        generateMenuItems(filteredMenuData);
    } catch (error) {
        console.error('Error fetching menu data:', error);
    }
}

function generateMenuItems(menuData) {  
    const menuContainer = document.getElementById('menu-items');
    menuContainer.innerHTML = ''; // Clear previous content

    menuData.forEach((item) => {
        const cardHTML = `
            <div class="col-6 mb-3">
                <div class="card">
                    <div class="card-body d-flex flex-column justify-content-between" data-id="${item.id}" data-item="${item.item}" data-name="${item.name}" data-price="${item.price}">
                        <div class="text-left ${item.isVeg ? 'text-success' : 'text-danger'}">
                            <i class="fa-solid fa-circle fa-2xs ml-0"></i>
                        </div>
                        <div>
                            <h4 class="text-center">${item.name}</h4>
                        </div>
                        <div class="row">
                            <div class="col-6 d-flex justify-content-center align-items-center text-success">
                                ₹ ${item.price}
                            </div>
                            <div class="col-6 d-flex justify-content-center align-items-center">
                                <button class="btn btn-light btn-sm decrement-btn">-</button>
                                <span class="count-value"> 0 </span>
                                <button class="btn btn-light btn-sm increment-btn">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        menuContainer.insertAdjacentHTML('beforeend', cardHTML);
    });

    // Add event listeners for increment and decrement buttons
    menuContainer.querySelectorAll('.increment-btn').forEach(button => {
        button.addEventListener('click', () => {
            const cardBody = button.closest('.card-body');
            const countSpan = cardBody.querySelector('.count-value');
            let count = parseInt(countSpan.textContent.trim());
            countSpan.textContent = ` ${++count} `;
            updateOrderedItems(parseInt(cardBody.dataset.id), parseInt(cardBody.dataset.item), cardBody.dataset.name, parseFloat(cardBody.dataset.price), count);
        });
    });

    menuContainer.querySelectorAll('.decrement-btn').forEach(button => {
        button.addEventListener('click', () => {
            const cardBody = button.closest('.card-body');
            const countSpan = cardBody.querySelector('.count-value');
            let count = parseInt(countSpan.textContent.trim());
            if (count > 0) {
                countSpan.textContent = ` ${--count} `;
                updateOrderedItems(parseInt(cardBody.dataset.id), parseInt(cardBody.dataset.item), cardBody.dataset.name, parseFloat(cardBody.dataset.price), count);
            }
        });
    });
}

function updateOrderedItems(id, item, name, price, count) {
    console.log(`Updating item ${id}-${item} with count ${count}`);
    let itemIndex = orderedItems.findIndex(item => item.id === id && item.item === item);
    if (itemIndex > -1) {
        orderedItems[itemIndex].count = count;
    } else {
        orderedItems.push({ id, item, name, price, count });
    }
    displayOrderedItems();
}
function displayOrderedItems() {
    console.log("Displaying ordered items:");
    let totalPrice = 0;
    let html = "";

    if (orders.length === 0) {
        html = "<h4 class='mt-3'>No dishes selected</h4>";
    } else {
        orders.forEach(item => {
            html += `
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="mt-3">${item.name} <span class="text-muted"> x ${item.count}</span></h4>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-light btn-sm decrement-btn">-</button>
                        <span class="count-value mx-2">${item.count}</span>
                        <button class="btn btn-light btn-sm increment-btn">+</button>
                    </div>
                </div>
            `;
            totalPrice += item.price * item.count;
        });
    }

    const orderedItemsElement = document.getElementById("orderItems");
    if (orderedItemsElement) {
        orderedItemsElement.innerHTML = html;
    } else {
        console.error("Error: No element with ID 'orderItems' found.");
    }

    // Add event listeners for increment and decrement buttons
    const incrementButtons = document.querySelectorAll('.increment-btn');
    const decrementButtons = document.querySelectorAll('.decrement-btn');

    incrementButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemName = button.parentElement.previousElementSibling.textContent.trim();
            const selectedItem = orders.find(item => item.name === itemName);
            if (selectedItem) {
                selectedItem.count++;
                displayOrderedItems();
            }
        });
    });

    decrementButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemName = button.parentElement.previousElementSibling.textContent.trim();
            const selectedItem = orders.find(item => item.name === itemName);
            if (selectedItem && selectedItem.count > 0) {
                selectedItem.count--;
                displayOrderedItems();
            }
        });
    });
}




document.addEventListener('DOMContentLoaded', () => {
    let id;
    const path = window.location.pathname;

    // Determine id based on the current HTML page
    if (path.includes('biriyani.html')) {
        id = 1;
    } else if (path.includes('combo.html')) {
        id = 2;
    } else if (path.includes('friedrice.html')) {
        id = 3;
    } else if (path.includes('page4.html')) {
        id = 4;
    } else {
        console.error('Unknown HTML page:', path);
        return;
    }

    fetchMenuData(id, 'all');

    // Add event listeners to All, Veg, and Non-Veg buttons
    const allButton = document.getElementById('allButton');
    const vegButton = document.getElementById('vegButton');
    const nonVegButton = document.getElementById('nonVegButton');

    allButton.addEventListener('click', () => {
        fetchMenuData(id, 'all'); // Fetch and display all items
    });

    vegButton.addEventListener('click', () => {
        fetchMenuData(id, 'veg'); // Fetch and display vegetarian items
    });

    nonVegButton.addEventListener('click', () => {
        fetchMenuData(id, 'nonVeg'); // Fetch and display non-vegetarian items
    });
});

// Back function
function navigateToIndex() {
    window.location.href = "../index.html";
}

// Modal popup logic
document.getElementById('categoryDropdown3').addEventListener('click', showOrderPopup);
document.querySelector('.close').addEventListener('click', closeOrderPopup);

// Close the modal when clicking outside of it
window.onclick = function (event) {
    const modal = document.getElementById('orderPopup');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Show the order popup
function showOrderPopup() {
    const modal = document.getElementById('orderPopup');
    modal.style.display = 'block';
    displayOrderedItems();
}

// Close the order popup
function closeOrderPopup() {
    const modal = document.getElementById('orderPopup');
    modal.style.display = 'none';
}

// Show the modal on page load
window.onload = function() {
    document.getElementById('imageModal').style.display = 'flex';
};

// Get the close button element
const closeBtn = document.querySelector('.close-btn');

// Add click event listener to the close button
closeBtn.addEventListener('click', function() {
    document.getElementById('imageModal').style.display = 'none';
});

// Add click event listener to close the modal when clicking outside of the modal content
window.addEventListener('click', function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
