const cartDisplay = document.getElementById("cart__items");
const totalQuantityDisplay = document.getElementById("totalQuantity");
let totalQuantityValue = 0;
const totalPriceDisplay = document.getElementById("totalPrice");
let totalPriceValue = 0;

async function getProductDetails(id) {
    try {
        const response = await fetch(`http://127.0.0.1:3000/api/products/${id}`);
        return await response.json();
    }
    catch (e) {
        console.log(e);
    }
}

class Cart {
    constructor() {
        let cart = localStorage.getItem("cart");
        if (!cart) this.cart = []
        else this.cart = JSON.parse(cart).sort((a, b) => {
            if (a.id < b.id) return -1
            else if (a.id > b.id) return 1
            else return 0
        });
    }

    save() {
        localStorage.setItem("cart", JSON.stringify(this.cart))
    }

    getItem(id, color) {
        return this.cart.find(e => e.id === id && e.color === color)
    }

    remove(id, color) {
        this.cart = this.cart.filter(product => product.id != id || product.color != color);
        this.save();
    }

    getQuantity(id, color) {
        let foundProduct = this.getItem(id, color);
        return foundProduct.quantity;
    }

    changeQuantity(id, color, quantity) {
        let productQuantity = this.getQuantity(id, color);
        productQuantity = quantity;
        this.save()
    }

}

let cart = new Cart();

function appendProduct(productDetails, cartDetails) {
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

async function displayCartProducts() {
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

async function getProductPrice(id) {
    try {
        const product = await getProductDetails(id);
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
    return { id, color };
}

for (let i = 0; i < cartQuantityInputs.length; i++) {
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
                cart.changeQuantity(id, color, newQuantity);
                updateTotalPrice(await getProductPrice(id), quantityDifference);
                updateTotalQuantity(quantityDifference);
                cart.changeQuantity(id, color, newQuantity);
            }
        } catch (error) {
            console.log(error);
        }
    })
}

for (let i = 0; i < cartDeleteBtns.length; i++) {
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
        return await res.json();
    } catch (error) {
        console.log(error);
    }

}

orderBtn.addEventListener("click", async function (e) {
    try {
        e.preventDefault();
        if (firstNameInput.value && lastNameInput.value && addressInput.value && emailInput.value && cityInput.value) {
            if (localStorage.length) {
                let contact = {
                    firstName: firstNameInput.value,
                    lastName: lastNameInput.value,
                    address: addressInput.value,
                    city: cityInput.value,
                    email: emailInput.value
                }
                let products = cart.cart.map(e => e.id);
                let body = {
                    contact: contact,
                    products: products
                }
                const orderInfo = await sendOrder(body);
                window.location = `./confirmation.html?orderId=${orderInfo.orderId}`
            } else alert("Votre panier est vide !")
        } else {
            alert("Veuillez renseigner tous les champs du formulaire")
        }
    } catch (error) {
        console.log(error);
    }
})