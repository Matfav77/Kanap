export class Cart {
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

    add(product) {
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

