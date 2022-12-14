export class Cart {
    constructor() { // creates an object with a .cart property: either as an empty array if there is nothing in the local storage, or as what is stored in the localstorage under key "cart"(all sorted in ascending order of ID).
        let cart = localStorage.getItem("cart");
        if (!cart) this.cart = []
        else this.cart = JSON.parse(cart).sort((a, b) => {
            if (a.id < b.id) return -1
            else if (a.id > b.id) return 1
            else return 0
        });
    }

    save() { // saves cart in local storage and takes care of turning it to JSON format beforehand.
        localStorage.setItem("cart", JSON.stringify(this.cart))
    }

    add(product) { // adds a product to the cart, handles already added products, increments quantity and checks that quantity remains under 100
        let storedProduct = this.cart.find(e => e.id === product.id && e.color === product.color);
        if (!storedProduct) {
            this.cart.push(product);
            this.save();
            alert("Votre sélection a bien été ajoutée au panier !");
        } else {
            if (storedProduct.quantity + product.quantity > 100) {
                alert(`Vous ne pouvez avoir plus de 100 exemplaires d'un même produit dans le panier. Vous avez déjà ${storedProduct.quantity} exemplaires de ce produit dans le panier. Vous pouvez en ajouter ${100 - storedProduct.quantity} au maximum.`);
            } else {
                storedProduct.quantity += product.quantity;
                this.save();
                alert(`Vous avez ajouté ${product.quantity} exemplaires de ce produit à votre panier. Votre panier en contient à présent ${storedProduct.quantity} exemplaires.`);
            }
        }
    }

    getItem(id, color) { // Returns a product from localStorage
        return this.cart.find(e => e.id === id && e.color === color)
    }

    remove(id, color) { // Removes an item from localStorage
        this.cart = this.cart.filter(product => product.id != id || product.color != color);
        this.save();
    }

    getQuantity(id, color) { // Returns quantity of a product in localStorage
        let foundItem = this.getItem(id, color);
        return foundItem.quantity;
    }

    changeQuantity(id, color, quantity) { // Changes quantity of a product in localStorage
        let foundItem = this.getItem(id, color)
        foundItem.quantity = quantity;
        this.save();
    }

    isEmpty() {
        if (this.cart.length === 0) return true
        return false
    }
}

