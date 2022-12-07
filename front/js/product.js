import { Cart } from "./utils/Cart.js";
import { getProductDetails } from "./utils/api-queries.js";

const params = new URL(window.location.href).search; // Gets query string from URL
const id = new URLSearchParams(params).get("id");    // Gets id from query string

const productImgDisplay = document.querySelector(".item__img");
const productNameDisplay = document.getElementById("title");
const productPriceDisplay = document.getElementById("price");
const productDescriptionDisplay = document.getElementById("description");
const productColorPicker = document.getElementById("colors");

// Generates image from product details and appends it to the page.
function appendImg(product) {
    const img = document.createElement("img");
    img.src = product.imageUrl;
    img.alt = product.altTxt;
    productImgDisplay.appendChild(img);
}

// Generates name, price and description from product details and appends them to the page.
function appendNamePriceDescription(product) {
    productNameDisplay.innerText = product.name;
    productPriceDisplay.innerText = product.price;
    productDescriptionDisplay.innerText = product.description;
}

// Generates colour options from product details and appends them to the selector
function appendColors(product) {
    for (let color of product.colors) {
        const newOption = document.createElement("option");
        newOption.value = color;
        newOption.innerText = color;
        productColorPicker.appendChild(newOption);
    }
}

// Fetches product details and calls append functions
async function appendProductDetails() {
    try {
        const product = await getProductDetails(id);
        appendImg(product);
        appendNamePriceDescription(product);
        appendColors(product);
    } catch (error) {
        console.log(error);
    }
}

appendProductDetails();


const quantityInput = document.getElementById("quantity");
const addToCartBtn = document.getElementById("addToCart");

let cart = new Cart();

// Handles 'add to cart' event, checking that value in input is integer between 1 and 100 and that a color is selected, check method add in Cart.js for further validations.
addToCartBtn.addEventListener('click', function () {
    if (!Number.isInteger(parseFloat(quantityInput.value)) || quantityInput.value < 1 || quantityInput.value > 100) {
        alert("La quantité d'articles doit être un nombre entier compris entre 1 et 100.");
        quantityInput.value = 0;
    } else if (!productColorPicker.value) {
        alert("Veuillez choisir une couleur.")
    } else {
        const color = productColorPicker.value;
        const quantity = parseInt(quantityInput.value);
        const product = {
            id: id,
            color: color,
            quantity: quantity
        };
        cart.add(product);
        quantityInput.value = 0;
    }
})