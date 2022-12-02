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
        const product = await response.json();
        return product;
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