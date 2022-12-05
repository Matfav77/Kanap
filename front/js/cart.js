const cartDisplay = document.getElementById("cart__items");
const totalQuantityDisplay = document.getElementById("totalQuantity");
let totalQuantityValue = 0;
const totalPriceDisplay = document.getElementById("totalPrice");
let totalPriceValue = 0;
let individualItemQuantity = [];

async function getProduct(id) {
    try {
        const response = await fetch(`http://127.0.0.1:3000/api/products/${id}`);
        return await response.json();
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
                    <p>${product.price} €</p>
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
            const productQuantity = parseInt(cartDetails.quantity);
            totalQuantityValue += productQuantity;
            totalPriceValue += product.price * productQuantity;
            individualItemQuantity.push(productQuantity);
            appendProduct(product, cartDetails);
        }
        totalQuantityDisplay.innerText = totalQuantityValue;
        totalPriceDisplay.innerText = totalPriceValue;
    } catch (error) {
        console.log(error);
    }
}

await displayCartProducts();


const cartQuantityInputs = document.querySelectorAll(".itemQuantity");
const cartDeleteBtns = document.querySelectorAll(".deleteItem");

function getCartDetails(id, color) {
    const cartDetailsJson = localStorage.getItem(`${id} - ${color}`);
    return JSON.parse(cartDetailsJson);
}

async function getProductPrice(id) {
    try {
        const product = await getProduct(id);
        return parseInt(product.price);
    } catch (error) {
        console.log(error);
    }
}

function updateTotalPrice(price, quantity) {
    totalPriceValue -= price * quantity;
    totalPriceDisplay.innerText = totalPriceValue;
}

function updateTotalQuantity(quantity) {
    totalQuantityValue -= quantity;
    totalQuantityDisplay.innerText = totalQuantityValue;
}

function getIdAndColor(element) {
    const parentElement = element.closest('article');
    const id = parentElement.dataset.id;
    const color = parentElement.dataset.color;
    return { id: id, color: color };
}

for (let i = 0; i < cartQuantityInputs.length; i++) {
    cartQuantityInputs[i].addEventListener("change", async function () {
        try {
            const newQuantity = parseFloat(this.value);
            const storedQuantity = individualItemQuantity[i];
            if (!Number.isInteger(newQuantity) || this.value < 1 || this.value > 100) {
                alert("La quantité d'articles doit être un nombre entier compris entre 1 et 100");
                this.value = storedQuantity;
            }
            else {
                const quantityDifference = storedQuantity - newQuantity;
                const { id, color } = getIdAndColor(this);
                const cartDetails = getCartDetails(id, color);
                cartDetails.quantity = newQuantity;
                localStorage.setItem(`${id} - ${color}`, JSON.stringify(cartDetails))
                updateTotalPrice(await getProductPrice(id), quantityDifference);
                updateTotalQuantity(quantityDifference);
                individualItemQuantity[i] = newQuantity;
            }
        } catch (error) {
            console.log(error);
        }
    })
}

for (let i = 0; i < cartDeleteBtns.length; i++) {
    cartDeleteBtns[i].addEventListener("click", async function () {
        try {
            const currentQuantity = individualItemQuantity[i];
            let { id, color } = getIdAndColor(this);
            updateTotalPrice(await getProductPrice(id), currentQuantity);
            updateTotalQuantity(currentQuantity);
            this.closest("article").remove();
            localStorage.removeItem(`${id} - ${color}`);
        } catch (error) {
            console.log(error);
        }
    })
}

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const addressInput = document.getElementById("address");
const cityInput = document.getElementById("city");
const emailInput = document.getElementById("email");

firstNameInput.addEventListener("change", function () {
    if (!/^[a-zéèêàâôùûìî-]+$/i.test(firstNameInput.value)) {
        alert("Le prénom n'est pas au bon format.");
        firstNameInput.value = "";
    }
})
lastNameInput.addEventListener("change", function () {
    if (!/^[a-zçéèêàâôùûìî-]+$/i.test(lastNameInput.value)) {
        alert("Le nom de famille n'est pas au bon format.");
        lastNameInput.value = "";
    }
})

addressInput.addEventListener("change", function () {
    if (!/^\d+[a-z]*(\s{1}[a-zçéèêàâôùûìî-]+)+$/i.test(addressInput.value)) {
        alert("L'adresse n'est pas au bon format.");
        addressInput.value = "";
    }
})
cityInput.addEventListener("change", function () {
    if (!/^[a-zéèêàâôùûìî-]+$/i.test(cityInput.value)) {
        alert("Le nom de ville n'est pas au bon format.");
        cityInput.value = "";
    }
})
emailInput.addEventListener("change", function () {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailInput.value)) {
        alert("L'adresse email n'est pas au bon format.");
        emailInput.value = "";
    }
})

// /^[a-zéèêàâôùûìî-]+$/i test prénom, nom, ville
// /^\d+[a-zA-Z]*(( )?/w+)+$/ test adresse
// /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ test adresse email

const orderBtn = document.getElementById("order");

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
        if (firstNameInput.value && lastNameInput.value && addressInput.value && emailInput.value && cityInput.value) {
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
        } else {
            alert("Veuillez renseigner tous les champs du formulaire")
        }
    } catch (error) {
        console.log(error);
    }
})