export async function getAllProducts() {
    try {
        const res = await fetch("http://127.0.0.1:3000/api/products");
        return await res.json();
    }
    catch (error) {
        console.log(error);
    }
}

export async function getProductDetails(id) {
    try {
        const response = await fetch(`http://127.0.0.1:3000/api/products/${id}`);
        return await response.json();
    }
    catch (e) {
        console.log(e);
    }
}

export async function getProductPrice(id) {
    try {
        const product = await getProductDetails(id);
        return parseInt(product.price);
    } catch (error) {
        console.log(error);
    }
}