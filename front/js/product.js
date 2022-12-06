const params = new URL(window.location.href).search;
const id = new URLSearchParams(params).get("id");

const itemImg = document.querySelector(".item__img");
const itemName = document.getElementById("title");
const itemPrice = document.getElementById("price");
const itemDescription = document.getElementById("description");
const itemColorPicker = document.getElementById("colors");

async function getProduct() {
    try {
        const response = await fetch(`http://127.0.0.1:3000/api/products/${id}`);
        return await response.json();
    }
    catch (e) {
        console.log(e);
    }
}

function appendImg(product) {
    const img = document.createElement("img");
    img.src = product.imageUrl;
    img.alt = product.altTxt;
    itemImg.appendChild(img);
}

function appendNamePriceDescription(product) {
    itemName.innerText = product.name;
    itemPrice.innerText = product.price;
    itemDescription.innerText = product.description;
}

function appendColors(product) {
    for (let color of product.colors) {
        const newOption = document.createElement("option");
        newOption.value = color;
        newOption.innerText = color;
        itemColorPicker.appendChild(newOption);
    }
}

async function appendProductDetails() {
    try {
        const product = await getProduct();
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

class Cart {
    constructor() {
        let cart = localStorage.getItem("cart");
        if (!cart) this.cart = []
        else this.cart = JSON.parse(cart)
    }

    save() {
        localStorage.setItem("cart", JSON.stringify(this.cart))
    }

    add(product) {
        let storedProduct = this.cart.find(e => e.id === product.id && e.color === product.color);
        if (!storedProduct) {
            this.cart.push(product);
            this.save();
            alert("Votre sélection a bien été ajoutée au panier !");
        } else {
            if (storedProduct.quantity + product.quantity > 100) {
                alert(`Vous ne pouvez avoir plus de 100 exemplaires d'un même produit dans le panier. Vous avez déjà ${storedProduct.quantity} exemplaires de ce produit dans le panier. Vous pouvez en ajouter ${100 - storedProduct.quantity} au maximum.`);
                quantityInput.value = 0;
            } else {
                storedProduct.quantity += product.quantity;
                this.save();
                quantityInput.value = 0;
                alert(`Vous avez ajouté ${product.quantity} exemplaires de ce produit à votre panier. Votre panier en contient à présent ${storedProduct.quantity} exemplaires.`);
            }
        }
    }

}

let cart = new Cart();

addToCartBtn.addEventListener('click', function () {
    if (!Number.isInteger(parseFloat(quantityInput.value)) || quantityInput.value < 1 || quantityInput.value > 100) {
        alert("La quantité d'articles doit être un nombre entier compris entre 1 et 100.");
        quantityInput.value = 0;
    } else if (!itemColorPicker.value) {
        alert("Veuillez choisir une couleur.")
    } else {
        const color = itemColorPicker.value;
        const quantity = parseInt(quantityInput.value);
        const product = {
            id: id,
            color: color,
            quantity: quantity
        };
        cart.add(product);
    }
})