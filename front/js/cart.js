const cartDisplay = document.getElementById("cart__items");

async function getProduct(id) {
    try {
        const response = await fetch(`http://127.0.0.1:3000/api/products/${id}`);
        const product = await response.json();
        return product;
    }
    catch (e) {
        console.log(e);
    }
}

function appendProduct(product, cartDetails) {
    cartDisplay.innerHTML += `
    <article class="cart__item" data-id="${product._id}" data-color="${cartDetails.color}">
                <div class="cart__item__img">
                  <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${cartDetails.color}</p>
                    <p>${product.price}</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartDetails.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`
}

async function displayCartProducts() {
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const jsonItem = localStorage.getItem(localStorage.key(i));
            const cartDetails = JSON.parse(jsonItem);
            const product = await getProduct(cartDetails.id);
            appendProduct(product, cartDetails);
        }
    } catch (error) {
        console.log(error);
    }
}

await displayCartProducts();

const cartQuantityInputs = document.querySelectorAll(".itemQuantity");
const cartDeleteBtns = document.querySelectorAll(".deleteItem");

for (let qtyInput of cartQuantityInputs) {
    qtyInput.addEventListener("change", function () {
        let newQuantity = this.value;
        const parentElement = this.closest('article');
        let id = parentElement.dataset.id;
        let color = parentElement.dataset.color;
        const oldCartDetailsJson = localStorage.getItem(`${id} - ${color}`);
        const oldCartDetails = JSON.parse(oldCartDetailsJson);
        oldCartDetails.quantity = newQuantity;
        const newCartDetails = JSON.stringify(oldCartDetails);
        localStorage.setItem(`${id} - ${color}`, newCartDetails)
    })
}

for (let deleteBtn of cartDeleteBtns) {
    deleteBtn.addEventListener("click", function () {
        const parentElement = this.closest('article');
        let id = parentElement.dataset.id;
        let color = parentElement.dataset.color;
        parentElement.remove();
        localStorage.removeItem(`${id} - ${color}`);
    })
}

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const addressInput = document.getElementById("address");
const cityInput = document.getElementById("city");
const emailInput = document.getElementById("email");
const orderBtn = document.getElementById("order");

// /^[a-zéèêàâôùûìî-]+$/i test prénom, nom, ville
// /^\d+[a-zA-Z]*(( )?/w+)+$/ test adresse
// /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ test adresse email



async function sendOrder(request) {
    try {
        const res = await fetch("http://127.0.0.1:3000/api/products/order", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        });
        const orderInfo = await res.json();
        return orderInfo;
    } catch (error) {
        console.log(error);
    }

}

orderBtn.addEventListener("click", async function (e) {
    try {
        e.preventDefault();
        const cartItems = document.querySelectorAll(".cart__item");
        let contact = {
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            address: addressInput.value,
            city: cityInput.value,
            email: emailInput.value
        }
        let products = [];
        for (let i = 0; i < cartItems.length; i++) {
            products.push(cartItems[i].dataset.id);
        }
        let body = {
            contact: contact,
            products: products
        }
        const orderInfo = await sendOrder(body);
        window.location = `./confirmation.html?orderId=${orderInfo.orderId}`
    } catch (error) {
        console.log(error);
    }
})