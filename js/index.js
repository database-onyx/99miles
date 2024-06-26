document.addEventListener('DOMContentLoaded', function() {
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
        const response = await fetch('../categories/menu.json');
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
                                <button class="btn btn-light btn-sm decrement-btn" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">-</button>
                                <span class="count-value"> 0 </span>
                                <button class="btn btn-light btn-sm increment-btn" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        menuContainer.insertAdjacentHTML('beforeend', cardHTML);
    });

    // Add event listeners for increment and decrement buttons
    const incrementButtons = document.querySelectorAll('.increment-btn');
    const decrementButtons = document.querySelectorAll('.decrement-btn');

    incrementButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.dataset.id);
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            let count = parseInt(button.previousElementSibling.textContent.trim());

            count++;
            button.previousElementSibling.textContent = count;
            updateOrderedItems(id, name, price, count);
        });
    });

    decrementButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.dataset.id);
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            let count = parseInt(button.nextElementSibling.textContent.trim());

            if (count > 0) {
                count--;
                button.nextElementSibling.textContent = count;
                updateOrderedItems(id, name, price, count);
            }
        });
    });
}

function updateOrderedItems(id, name, price, count) {
    console.log(`Updating item ${id}-${name} with count ${count}`);
    let itemIndex = orderedItems.findIndex(item => item.id === id && item.name === name);
    if (itemIndex > -1) {
        orderedItems[itemIndex].count = count;
        if (count === 0) {
            orderedItems.splice(itemIndex, 1); // Remove item if count is zero
        }
    } else {
        orderedItems.push({ id, name, price, count });
    }
    displayOrderedItems();
}

function displayOrderedItems() {
    console.log("Displaying ordered items:");
    let totalPrice = 0;
    let html = "";

    if (orderedItems.length === 0) {
        html = "<h4 class='mt-3'>No dishes selected</h4>";
    } else {
        orderedItems.forEach(item => {
            html += `
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="mt-3">${item.name} <span class="text-muted"> x ${item.count}</span></h4>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-light btn-sm decrement-btn" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">-</button>
                        <span class="count-value mx-2">${item.count}</span>
                        <button class="btn btn-light btn-sm increment-btn" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">+</button>
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
    const incrementButtons = document.querySelectorAll('#orderItems .increment-btn');
    const decrementButtons = document.querySelectorAll('#orderItems .decrement-btn');

    incrementButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.dataset.id);
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            let count = parseInt(button.previousElementSibling.textContent.trim());

            count++;
            button.previousElementSibling.textContent = count;
            updateOrderedItems(id, name, price, count);
        });
    });

    decrementButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.dataset.id);
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            let count = parseInt(button.nextElementSibling.textContent.trim());

            if (count > 0) {
                count--;
                button.nextElementSibling.textContent = count;
                updateOrderedItems(id, name, price, count);
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
window.onclick = function(event) {
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
