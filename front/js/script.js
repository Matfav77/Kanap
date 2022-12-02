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
        const allKanaps = await res.json();
        return allKanaps;
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

function appendKanap(kanap) {
    itemDisplay.innerHTML += `
    <a href="./product.html?id=${kanap._id}">
            <article>
              <img src="${kanap.imageUrl}" alt="${kanap.altTxt}">
              <h3 class="productName">${kanap.name}</h3>
              <p class="productDescription">${kanap.description}</p>
            </article>
          </a>`;
}

async function displayAllKanaps() {
    const allKanaps = await getAllProducts();
    for (let kanap of allKanaps) {
        appendKanap(kanap);
    }
}

displayAllKanaps();
