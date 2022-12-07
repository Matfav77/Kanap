const params = new URL(window.location.href).search;        // Gets query string from URL 
const orderId = new URLSearchParams(params).get("orderId"); // Gets order ID from query string

const orderIdDisplay = document.getElementById("orderId");

orderIdDisplay.innerText = orderId;