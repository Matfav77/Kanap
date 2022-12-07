import { Cart } from "./utils/Cart.js";
import { getProductDetails, getProductPrice, sendOrder } from "./utils/api-queries.js";

const cartDisplay = document.getElementById("cart__items");
const totalQuantityDisplay = document.getElementById("totalQuantity");
let totalQuantityValue = 0;
const totalPriceDisplay = document.getElementById("totalPrice");
let totalPriceValue = 0;

let cart = new Cart();

function appendProduct(productDetails, cartDetails) { // Appends a product's cart details, and associated DB details, to the page
    cartDisplay.innerHTML += `
    <article class="cart__item" data-id="${productDetails._id}" data-color="${cartDetails.color}">
                <div class="cart__item__img">
                  <img src="${productDetails.imageUrl}" alt="${productDetails.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${productDetails.name}</h2>
                    <p>${cartDetails.color}</p>
                    <p>${productDetails.price} €</p>
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

async function displayCartProducts() { // On page load: displays all products in the cart using append function, handles total price and total quantity.
    try {
        for (let cartDetails of cart.cart) {
            const productDetails = await getProductDetails(cartDetails.id);
            const quantity = cartDetails.quantity;
            totalQuantityValue += quantity;
            totalPriceValue += productDetails.price * quantity;
            appendProduct(productDetails, cartDetails);
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

function updateTotalPrice(price, quantity) {
    totalPriceValue -= price * quantity;
    totalPriceDisplay.innerText = totalPriceValue;
}

function updateTotalQuantity(quantity) {
    totalQuantityValue -= quantity;
    totalQuantityDisplay.innerText = totalQuantityValue;
}

function getIdAndColor(element) { // Gets id and color of a product (stored as dataset in HTML), from a child element within the product's display
    const parentElement = element.closest('article');
    const id = parentElement.dataset.id;
    const color = parentElement.dataset.color;
    return { id, color };
}

for (let i = 0; i < cartQuantityInputs.length; i++) { // Handles change in a product's quantity, checks that new quantity is integer between 1 - 100, updates total price and quantity, updates localStorage.
    cartQuantityInputs[i].addEventListener("change", async function () {
        try {
            const newQuantity = parseFloat(this.value);
            const { id, color } = getIdAndColor(this);
            const storedQuantity = cart.getQuantity(id, color);
            if (!Number.isInteger(newQuantity) || this.value < 1 || this.value > 100) {
                alert("La quantité d'articles doit être un nombre entier compris entre 1 et 100");
                this.value = storedQuantity;
            }
            else {
                const quantityDifference = storedQuantity - newQuantity;
                updateTotalPrice(await getProductPrice(id), quantityDifference);
                updateTotalQuantity(quantityDifference);
                cart.changeQuantity(id, color, newQuantity);
            }
        } catch (error) {
            console.log(error);
        }
    })
}

for (let i = 0; i < cartDeleteBtns.length; i++) { // Handles deletion of product from the DOM and from localStorage, updates total price and quantity.
    cartDeleteBtns[i].addEventListener("click", async function () {
        try {
            const { id, color } = getIdAndColor(this);
            const storedQuantity = cart.getQuantity(id, color);
            updateTotalPrice(await getProductPrice(id), storedQuantity);
            updateTotalQuantity(storedQuantity);
            this.closest("article").remove();
            cart.remove(id, color);
        } catch (error) {
            console.log(error);
        }
    })
}

const firstNameInput = document.getElementById("firstName");
const firstNameErrorDisplay = document.getElementById("firstNameErrorMsg");
const lastNameInput = document.getElementById("lastName");
const lastNameErrorDisplay = document.getElementById("lastNameErrorMsg");
const addressInput = document.getElementById("address");
const addressErrorDisplay = document.getElementById("addressErrorMsg");
const cityInput = document.getElementById("city");
const cityErrorDisplay = document.getElementById("cityErrorMsg");
const emailInput = document.getElementById("email");
const emailErrorDisplay = document.getElementById("emailErrorMsg");

// The following functions check that each input of the form is valid with RegEx, displaying error message when false, returning boolean result of check.

function isFirstNameValid() {
    const isValid = (/^[a-zéèêàâôùûìî-]+$/i.test(firstNameInput.value));
    if (!isValid) firstNameErrorDisplay.innerText = "Le prénom n'est pas au bon format.";
    else firstNameErrorDisplay.innerText = "";
    return isValid
}

function isLastNameValid() {
    const isValid = (/^[a-zéèêàâôùûìî-]+$/i.test(lastNameInput.value));
    if (!isValid) lastNameErrorDisplay.innerText = "Le nom de famille n'est pas au bon format.";
    else lastNameErrorDisplay.innerText = "";
    return isValid
}
function isAddressValid() {
    const isValid = (/\w+/i.test(addressInput.value));
    if (!isValid) addressErrorDisplay.innerText = "L'adresse n'est pas au bon format.";
    else addressErrorDisplay.innerText = "";
    return isValid
}
function isCityValid() {
    const isValid = (/^[a-zéèêàâôùûìî\s{1}-]+$/i.test(cityInput.value));
    if (!isValid) cityErrorDisplay.innerText = "Le nom de ville n'est pas au bon format.";
    else cityErrorDisplay.innerText = "";
    return isValid
}
function isEmailValid() {
    const isValid = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailInput.value));
    if (!isValid) emailErrorDisplay.innerText = "L'email n'est pas au bon format.";
    else emailErrorDisplay.innerText = "";
    return isValid
}

const orderBtn = document.getElementById("order");

orderBtn.addEventListener("click", async function (e) { // Handles 'order' action, checks that all form inputs are filled in, then that basket is not empty, then that inputs are valid
    try {                                               // and sends to confirmation page with orderID in query string.
        e.preventDefault();
        const firstName = firstNameInput.value;
        const lastName = lastNameInput.value;
        const address = addressInput.value;
        const city = cityInput.value;
        const email = emailInput.value;
        if (firstName && lastName && address && email && city) {
            if (localStorage.length) {
                if (isFirstNameValid() && isLastNameValid() && isAddressValid() && isCityValid() && isEmailValid()) {
                    let contact = {
                        firstName,
                        lastName,
                        address,
                        city,
                        email
                    }
                    let products = cart.cart.map(e => e.id);
                    let body = {
                        contact,
                        products
                    }
                    const orderInfo = await sendOrder(body);
                    window.location = `./confirmation.html?orderId=${orderInfo.orderId}`
                }
            } else alert("Votre panier est vide !")
        } else {
            alert("Veuillez renseigner tous les champs du formulaire")
        }
    } catch (error) {
        console.log(error);
    }
})