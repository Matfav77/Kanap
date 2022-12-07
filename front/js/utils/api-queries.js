export async function getAllProducts() { // Queries API to get all products from DB, returns them parsed.
    try {
        const res = await fetch("http://127.0.0.1:3000/api/products");
        return await res.json();
    }
    catch (error) {
        console.log(error);
    }
}

export async function getProductDetails(id) { // Queries API to get a specific product from DB thanks to id, returns it parsed.
    try {
        const response = await fetch(`http://127.0.0.1:3000/api/products/${id}`);
        return await response.json();
    }
    catch (e) {
        console.log(e);
    }
}

export async function getProductPrice(id) { // Queries API to get a specific product's price from DB using getProductDetails function, returns it parsed.
    try {
        const product = await getProductDetails(id);
        return parseInt(product.price);
    } catch (error) {
        console.log(error);
    }
}

export async function sendOrder(order) { // Sends order to API, returns parsed response.
    try {
        const res = await fetch("http://127.0.0.1:3000/api/products/order", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        });
        return await res.json();
    } catch (error) {
        console.log(error);
    }

}