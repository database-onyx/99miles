let menuItems = [];
let orders = [];

// Constants
const ORDER_EXPIRY_TIME = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

// Function to load menu items from an external JSON file
function loadMenuItems() {
    fetch('../categories/menu.json')
        .then(response => response.json())
        .then(data => {
            menuItems = data;
            displayMenuItems(menuItems);
            // Load ordered items from localStorage on page load
            loadOrders();
        })
        .catch(error => console.error('Error fetching menu items:', error));
}

// Load menu items and orders on page load
loadMenuItems();

// Function to display menu items
function displayMenuItems(items) {
    const menuItemsContainer = document.getElementById('menu-items');
    menuItemsContainer.innerHTML = '';
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'col-6 col-md-4 mt-3';
        itemElement.innerHTML = `
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
                            <span class="count-value">0</span>
                            <button class="btn btn-light btn-sm increment-btn">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        menuItemsContainer.appendChild(itemElement);

        // Add event listeners for increment and decrement buttons
        const incrementBtn = itemElement.querySelector('.increment-btn');
        const decrementBtn = itemElement.querySelector('.decrement-btn');
        const countValue = itemElement.querySelector('.count-value');

        incrementBtn.addEventListener('click', () => {
            let count = parseInt(countValue.textContent);
            count++;
            countValue.textContent = count;
            updateOrderedItems(item.id, item.item, item.name, item.price, count);
        });

        decrementBtn.addEventListener('click', () => {
            let count = parseInt(countValue.textContent);
            if (count > 0) {
                count--;
                countValue.textContent = count;
                updateOrderedItems(item.id, item.item, item.name, item.price, count);
            }
        });
    });
}

// Function to update or add items to the order
function updateOrderedItems(id, item, name, price, count) {
    let existingOrder = orders.find(order => order.id === id && order.item === item);
    if (existingOrder) {
        existingOrder.count = count;
    } else {
        orders.push({ id, item, name, price, count });
    }
    displayOrderedItems();
    // Save orders to localStorage after each update
    saveOrders();
}

// Function to display ordered items
function displayOrderedItems() {
    console.log("Displaying ordered items:");
    let totalPrice = 0;
    let html = "";

    if (orders.length === 0) {
        html = "<h4 class='mt-3'>No dishes selected</h4>";
    } else {
        orders.forEach(item => {
            html += `<h4 class="mt-3">${item.name} <span class="text-muted pl-5"> x ${item.count}</span></h4>`;
            totalPrice += item.price * item.count;
        });
    }

    const orderedItemsElement = document.getElementById("orderItems");
    if (orderedItemsElement) {
        orderedItemsElement.innerHTML = html;
    } else {
        console.error("Error: No element with ID 'orderItems' found.");
    }
}
// Function to save orders to localStorage
function saveOrders() {
    const orderData = {
        timestamp: new Date().getTime(),
        orders: orders
    };
    localStorage.setItem('orders', JSON.stringify(orderData));
}

// Function to load orders from localStorage
function loadOrders() {
    const orderData = localStorage.getItem('orders');
    if (orderData) {
        const parsedOrderData = JSON.parse(orderData);
        const currentTime = new Date().getTime();
        if (currentTime - parsedOrderData.timestamp < ORDER_EXPIRY_TIME) {
            orders = parsedOrderData.orders;
            displayOrderedItems();
        } else {
            clearOrders();
        }
    }
}

// Function to clear orders from localStorage
function clearOrders() {
    orders = [];
    localStorage.removeItem('orders');
    displayOrderedItems();
}

// Function to search items
function searchItems() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredItems = menuItems.filter(item => item.name.toLowerCase().includes(searchInput));
    displayMenuItems(filteredItems);
}

// Event listener for search input
document.getElementById('searchInput').addEventListener('input', searchItems);

// Function to show order popup
function showOrderPopup() {
    document.getElementById('orderPopup').style.display = 'block';
}

// Function to close order popup
function closeOrderPopup() {
    document.getElementById('orderPopup').style.display = 'none';
}
