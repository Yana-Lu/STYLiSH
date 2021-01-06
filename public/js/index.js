//從common匯出的function
import { localStorage } from './common.js';
localStorage();
//新頁面先抓localStorage的紀錄
let cart = JSON.parse(window.localStorage.getItem("cart"));
let list = cart.list;
/*
========================================
header載入主要頁面，點擊按鈕跳轉category
========================================
*/

// 將a href的網址裝到容器裡
let Params = new URLSearchParams(window.location.search);
// let nextPage;
let belowPage;
let counter = 0;

function getProductData (category, nextPage = null) {
  const productReq = new XMLHttpRequest();
  let src = "";
  if(nextPage){
    src = `https://api.appworks-school.tw/api/1.0/products/${category}?paging=${nextPage}`;
  } else {
    src = `https://api.appworks-school.tw/api/1.0/products/${category}`;
  }

  productReq.onreadystatechange = () => {
    if (productReq.readyState === 4 && productReq.status === 200) {
      const productData = JSON.parse(productReq.responseText).data;
      const productPage = JSON.parse(productReq.responseText).next_paging;
      belowPage = productPage;
      outputData(productData, productPage);
    }
  };
  productReq.open('GET', src, true);
  productReq.send();
}
//將html文件中class=".products"第一個元素選出來放進容器
let content = document.querySelector(".products");

function outputData (items, page) {
  if (page == "null"){
    content.innerHTML = " ";
  }
  
  items.forEach ((item) => {
    let product = document.createElement("a");
    let productId = item.id;
    product.className = "product";
    product.href = `product.html?id=${productId}`
    content.appendChild(product);

    let productImg = item.main_image;
    let img = document.createElement("img");
    img.src = productImg;
    img.setAttribute("alt", "product-link");
    img.style.width = "100%";
    product.appendChild(img);

    let productColors = item.colors;
    productColors.forEach ((productColor) =>{
      let color = document.createElement("div");
      color.className = "product_color";
      color.style.backgroundColor = `#${productColor.code}`;
      product.appendChild(color);
    });

    let productName = item.title;
    let name = document.createElement("p");
    name.className = "product_intro";
    name.textContent = productName;
    product.appendChild(name);

    let prodictPrice = item.price;
    let price = document.createElement("p");
    price.className = "product_intro";
    price.textContent = `TWD.${prodictPrice}`;
    product.appendChild(price);
  });

  if (belowPage){
    // nextPage = page;
    counter = 0;
  } 
}

/*
==================================
頁面滾動到底，載入ajax第二頁的內容
==================================
*/

window.addEventListener("scroll", infinitScroll);
  
  function infinitScroll(){
    //文件的底部相較於視窗頂部的距離
    let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;
    //視窗的高度
    let windowHeight = document.documentElement.clientHeight;
    if (windowRelativeBottom - windowHeight < 100 ){
      counter = counter + 1;
      // console.log(counter);
       //scroll到底加一個標記防止重複做這個動作
      if (belowPage && counter == 1){
        getProductData (category, belowPage);
      }
    }
    
  }

/*
===================
搜尋功能
===================
*/

let keyword = Params.get("keyword");
// 把tag後面的字串提出來，判斷有沒有內容，沒有的話給all輸出全部內容
let tag = Params.get("tag");
let category = null;

if (!tag){
  category = "all";
} else {
  category = tag;
}

// 判斷keyword狀態:
// 1.沒有輸入=>aler並顯示上次的搜尋結果
// 2.未定義=>跑出主頁內容(非常重要!!!如果沒有這項就會不管輸入什麼都跑主頁內容，搜尋的內容會被蓋掉)
// 3.有keyword=>跑搜尋結果


if (keyword == ""){
  alert("請輸入欲搜尋的關鍵字");
  window.history.back();
} else if (keyword == undefined){
  getProductData(category);
} else {
  searchData (keyword);
}

function searchData (keyword, nextPage = null) {
  const productReq = new XMLHttpRequest();
  let src = "";
  if(nextPage){
    src = `https://api.appworks-school.tw/api/1.0/products/search?keyword=${keyword}?paging=${nextPage}`;
  } else {
    src = `https://api.appworks-school.tw/api/1.0/products/search?keyword=${keyword}`;
  }
//進入API找符合的array
  productReq.onreadystatechange = () => {
    if (productReq.readyState === 4 && productReq.status === 200) {
      const productData = JSON.parse(productReq.responseText).data;
      const productPage = JSON.parse(productReq.responseText).next_paging;
     //判斷array長度，如果==0表示資料庫中沒有搜尋到資料
      if(productData.length == 0){
        let noKeyword = document.createElement("p");
        noKeyword.textContent = "找不到這項商品喔";
        noKeyword.style.fontSize = "24px";
        content.appendChild(noKeyword);
      } else {
        outputData(productData, productPage);
      }
    } 
  };
  productReq.open('GET', src, true);
  productReq.send();
}

/*
===========
自動播放廣告
===========
*/
getKeyvisual ();

function getKeyvisual (){
  const visualReq = new XMLHttpRequest();
  let src = `https://api.appworks-school.tw/api/1.0/marketing/campaigns`;
  visualReq.onreadystatechange = () => {
    if (visualReq.readyState === 4 && visualReq.status === 200) {
      const visualData = JSON.parse(visualReq.responseText).data;
      renderKeyvisual(visualData);
    }
  }
  visualReq.open('GET', src, true);
  visualReq.send();
}


let visuals = [];
let circles = [];
let keyvisual = document.querySelector(".keyvisual");
// let currentVisual = document.querySelector(".visual.current");
// let currentCircle = document.querySelector(".circle.current");
// let step = document.querySelector(".step");
// let circle = document.querySelector(".circle");

function renderKeyvisual(data){
//data陣列
  data.map((obj) => {
    //背景圖片
    let visual = document.createElement("a");
    visual.className = "visual";
    visual.style.backgroundImage =`url(https://api.appworks-school.tw/assets/${obj.product_id}/keyvisual.jpg)`;
    visual.href = `./product.html?id=${obj.product_id}`;
    keyvisual.appendChild(visual);
    console.log(obj.product_id);
    //文字區塊
    let visualText = document.createElement("div");
    visualText.className = "story";
    visualText.innerHTML = obj.story.replace(/\s+/g, "<br/>");
    visual.appendChild(visualText);
  });

    //圓點區塊
    let step = document.createElement("div");
    step.className = "step";
    keyvisual.appendChild(step);
    //圓點為陣列
    for ( let i = 0; i < data.length; i++ ) {
      let circle = document.createElement("div");
      circle.className = "circle";
      circle.onclick = function (){
        clickChangeVisual(i);
      };
      step.appendChild(circle);
    }
    
    //顯示圖片及文字輪播，先顯示第一張圖
    visuals = document.querySelectorAll(".visual");
    circles = document.querySelectorAll(".circle");

    visuals[0].classList.add("current"); 
    circles[0].classList.add("current");
    // console.log(visuals);
    autoShowVisual(visuals, circles);
}
//點擊圈圈廣告牆播該廣告
function clickChangeVisual(circleIndex){

  for (let i = 0; i < circles.length; i++){
    visuals[i].classList.remove("current"); 
    circles[i].classList.remove("current");
  }
  visuals[circleIndex].classList.add("current");
  circles[circleIndex].classList.add("current");

  autoShowVisual(visuals, circles);

}


//每5秒輪播下一張圖片並顯示對應的文字及圈圈
let visualTimer;
function autoShowVisual(visuals, circles) {
  stopAutoShowVisual ();//清除點擊時傳進來的Index
  visualTimer = setInterval (() => {
    let currentIndex;
    // console.log(visuals);
    //這邊不能用querySelectorAll,querySelectorAll抓下是陣列，querySelector抓下來是元素
    let currentVisual = document.querySelector(".visual.current");
    let currentCircle = document.querySelector(".circle.current");
    //取出currentVisuals所有圖片的currentIndex
    for (let i = 0; i < visuals.length; i++){
      if( currentVisual === visuals[i]){
        currentIndex = i;
      }
    }

    if (currentIndex < visuals.length - 1){
      renewIndex(currentIndex + 1);
    } else {
      renewIndex(0);
    }

    function renewIndex(newIndex){
      currentVisual.classList.remove("current");
      visuals[newIndex].classList.add("current");
      currentCircle.classList.remove("current");
      circles[newIndex].classList.add("current");
    }
  } ,5000);
 
}

function stopAutoShowVisual (){
  clearInterval(visualTimer);
}

function reshowVisual(){
  autoShowVisual(visuals, circles);
}
keyvisual.addEventListener("mouseover", stopAutoShowVisual);
keyvisual.addEventListener("mouseout", reshowVisual);


/*
==================
改變購物車圖示的數字
===================
*/
let cartQty = document.getElementById("cart-qty");
let cartQtyMobile = document.getElementById("cart-qty-mobile");

//cart qty
cartQty.textContent = list.length;
cartQtyMobile.textContent = list.length;
