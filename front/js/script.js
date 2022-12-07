import { getAllProducts } from "./utils/api-queries.js";

const itemDisplay = document.getElementById("items");

function appendProduct(product) {
    itemDisplay.innerHTML += `
    <a href="./product.html?id=${product._id}">
            <article>
              <img src="${product.imageUrl}" alt="${product.altTxt}">
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.description}</p>
            </article>
          </a>`;
}

async function displayAllProducts() {
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