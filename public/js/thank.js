console.log(window.location.search);
let params = new URLSearchParams(window.location.search);
let number = params.get("number");
console.log(number);
let ordernumber = document.getElementById("productNumber");
ordernumber.textContent = number;


