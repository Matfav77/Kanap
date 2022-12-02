const cartDisplay = document.getElementById("cart__items");

async function getProduct(id) {
    try {
        const response = await fetch(`http://127.0.0.1:3000/api/products/${id}`);
        const product = await response.json();
        return product;
    }
    catch (e) {
        console.log(e);
    }
}

function appendProduct(product, cartDetails) {
    cartDisplay.innerHTML += `
    <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
                <div class="cart__item__img">
                  <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${cartDetails.color}</p>
                    <p>${product.price}</p>
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
    for (let i = 0; i < localStorage.length; i++) {
        const jsonItem = localStorage.getItem(localStorage.key(i));
        const cartDetails = JSON.parse(jsonItem);
        const product = await getProduct(cartDetails.id);
        appendProduct(product, cartDetails);
    }
}

displayCartProducts();