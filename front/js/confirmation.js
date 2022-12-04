const params = new URL(window.location.href).search;
const orderId = new URLSearchParams(params).get("orderId");

const orderIdDisplay = document.getElementById("orderId");

orderIdDisplay.innerText = orderId;