const itemDisplay = document.getElementById("items");

// function getAllProducts() {
//     fetch("http://127.0.0.1:3000/api/products")
//         .then(function (res) {
//             return res.json();
//         })
//         .then(function (data) {
//             return data
//         })
//         .catch(function (e) {
//             console.log(e);
//         })
// }

// getAllProducts();

async function getAllProducts() {
    try {
        const res = await fetch("http://127.0.0.1:3000/api/products");
        return await res.json();
    }
    catch (error) {
        console.log(error);
    }
}

// function appendKanap(kanap) {
//     const item = document.createElement("a");
//     item.href = `./product.html?id=${kanap._id}`;
//     const article = document.createElement("article");
//     const img = document.createElement("img");
//     img.src = `${kanap.imageUrl}`; img.alt = `${kanap.altTxt}`;
//     const h3 = document.createElement("h3");
//     h3.innerText = `${kanap.name}`
//     const p = document.createElement("p");
//     p.innerText = `${kanap.description}`;
//     article.append(img, h3, p);
//     item.appendChild(article);
//     itemDisplay.appendChild(item);
// }

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
