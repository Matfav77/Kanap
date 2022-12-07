import { getAllProducts } from "./utils/api-queries.js";

const itemDisplay = document.getElementById("items");

function appendProduct(product) { // Appends a product's details with a template literal, using product object from DB
    itemDisplay.innerHTML += `
    <a href="./product.html?id=${product._id}">
            <article>
              <img src="${product.imageUrl}" alt="${product.altTxt}">
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.description}</p>
            </article>
          </a>`;
}

async function displayAllProducts() { // Loops through all products in DB and calls append function on each one.
    try {
        const allProducts = await getAllProducts();
        for (let product of allProducts) {
            appendProduct(product);
        }
    } catch (error) {
        console.log(error);
    }
}

displayAllProducts();