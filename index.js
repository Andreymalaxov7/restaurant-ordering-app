import {menuArray} from "./data";

// const jsPlusButton = document.querySelector(".js-plus-btn");
const menuContainer = document.querySelector(".menu-container");
const cartContainer = document.querySelector("#order-summary");
let cart = [];

document.addEventListener('click', (event) => {
    if (event.target.classList.contains("js-plus-btn")) {
        const id = +event.target.dataset.id;
        const menuItem = menuArray[id]; // получение исходного товара

        let itemInCart = cart.find(item => item.id === id);
        if (!itemInCart) {
            // Копируем объект для корзины
            const itemCopy = { ...menuItem, quantity: 1 };
            cart.push(itemCopy);
        } else {
            itemInCart.quantity++;
        }
        renderCart(cart);
    }

    if (event.target.id === "checkout-btn" && cart.length > 0) {
        document.getElementById('modal-window').hidden = false;
    }

    if (event.target.id === 'submit-btn') {
        event.preventDefault();
        document.getElementById('modal-window').hidden = true;
        const name = document.getElementById('name').value;
        document.getElementById('changable-container').innerHTML = `
        <div id="final-word">
            <h2>Thanks, ${name}! Your order is on its way!</h2>
        </div>  
        `;
    }

    console.log(cart);
});

function renderCart(arr) {
    cartContainer.innerHTML = arr.map((e, i) => {
        return `
                <div class="item-summary" data-index="${i}">
                    <div class="summary-item-left">
                           <h3>${e.name}</h3>
                            <p class="item-quantity">(${e.quantity})</p>
                            <span class="remove-btn"">remove</span>
                        </div>
                        <div class="summary-item-right">
                            <p class="item-cost">$${e.price * e.quantity}</p>
                        </div>
                    </div>
        `
        }
    ).join('');

    cartContainer.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const parent = btn.closest(".item-summary");
            const index = +parent.dataset.index;

            if (arr[index].quantity > 1) {
                arr[index].quantity--;
            } else {
                arr.splice(index, 1);
            }
            renderCart(arr);
        })
    });

    document.getElementById('total-price-number').innerHTML = `$${calculateTotal(arr)}`
}

function renderMenu(arr) {
    menuContainer.innerHTML = arr.map(e => {
        return  `
            <div class="menu-element">
                <div class="item-left">
                    <span class="item-icon">${e.emoji}</span>
                    <div class="item-description">
                        <h4>${e.name}</h4>
                        <p>${e.ingredients}</p>
                        <span class="item-price">$${e.price}</span>
                    </div>
                </div>
                <div class="item-right">
                    <div class="js-plus-btn" data-id="${e.id}">
                        +
                    </div>
                </div>
            </div>
            <hr>
        `
    }).join('');
}

function calculateTotal(arr) {
    return +arr.reduce((acc, e) => acc + e.price * e.quantity, 0);
}

renderCart(cart);
renderMenu(menuArray);