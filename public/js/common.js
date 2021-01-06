/*
================================================================
1. Get current shopping cart data from localStorage.
2. If no data in localStorage, initialize it to an empty structure.
================================================================
*/

function localStorage(){
  let cart = {};
  let cartStorage = window.localStorage.getItem("cart");
  if (!cartStorage){ //判斷localStorage有沒有東西
    //沒東西
    cart = {
    freight: 0,
    list: [],
    payment: " ",
    recipient: {},
    shipping: " ",
    subtotal: 0,
    total: 0,
    }
    //這個狀態的cart存進去
    window.localStorage.setItem("cart", JSON.stringify(cart));
  }
}
//模組化匯出這個function給其他js檔案用
//html檔案的<script></script>裡面要加 type="module"
export {localStorage};


/*
================================================================
loding
================================================================
*/
function showLoading(){
  let loading = document.querySelector(".loading");
  loading.style.display = "block";
}

function hideLoading(){
  let loading = document.querySelector(".loading");
  loading.style.display = "none";
}

export {showLoading};
export {hideLoading};