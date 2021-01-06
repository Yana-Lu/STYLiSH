//從common匯出的function
import { localStorage } from './common.js';
localStorage();
//新頁面先抓localStorage的紀錄
let cart = JSON.parse(window.localStorage.getItem("cart"));
let list = cart.list;

const APIHost = "https://api.appworks-school.tw/api/1.0/";

/*
====================================================================
Ajax
====================================================================
*/
let params = new URLSearchParams(window.location.search);
let productId = params.get("id");
let detailsData;
console.log(productId);

function getProductDetails (productId){
  const productReq = new XMLHttpRequest();
  const src = `${APIHost}products/details?id=${productId}`;
  productReq.onreadystatechange = () => {
    if (productReq.readyState === 4 && productReq.status === 200 ){
      detailsData = JSON.parse(productReq.responseText).data;
      renderDetails(detailsData);
    }
  };
productReq.open("GET", src, true);
productReq.send();
}

const mainImage = document.querySelector(".main-image");
const name = document.querySelector(".name");
const id = document.querySelector(".id");
const price = document.querySelector(".price");
const colors = document.querySelector(".colors");
const sizes = document.querySelector(".sizes");
//數量顯示器
const op = document.querySelectorAll(".op");
let value = document.querySelector(".value");
let qty = 1;
const summary = document.querySelector(".summary");
const story = document.querySelector(".story");
const images = document.querySelector(".images");
// let details = document.querySelector(".details");
let variants;
let colorCode;
let size;
let stock = 0;
let cartQty = document.getElementById("cart-qty");
let cartQtyMobile = document.getElementById("cart-qty-mobile");

function renderDetails(data){
  variants = data.variants;
  //cart qty
  cartQty.textContent = list.length;
  cartQtyMobile.textContent = list.length;

  //main image
  const mainImg = document.createElement("img");
  mainImg.src = data.main_image;
  mainImg.setAttribute("alt", "product-picture");
  mainImage.appendChild(mainImg);

  //name.id.price
  name.innerHTML = data.title;
  id.innerHTML = productId;
  price.innerHTML = `TWD.${data.price}`;

  //colors
  for (let i = 0; i < data.colors.length; i++){
    let color = document.createElement("div");
    color.className = "color";
    //color.style.backgroundColor = `#${data.colors[i].code}`;
    color.setAttribute("style", `background-color: #${data.colors[i].code}`);
    color.name = data.colors[i].name;
    color.onclick = selectColor;
    colors.appendChild(color);
  }
  const colorList = colors.querySelectorAll(".color");
  colorList[0].classList.add("current");

  //sizes
  for (let i = 0; i < data.sizes.length; i++){
    let size = document.createElement("div");
    size.className = "size";
    size.textContent = data.sizes[i];
    size.setAttribute("textContent", data.sizes[i]);
    size.onclick = function (){
      selectSize(i);
    };
    sizes.appendChild(size);
  }
  const sizeList = sizes.querySelectorAll(".size");
  sizeList[0].classList.add("current");

  //qty
  value.textContent = qty;
  op[0].onclick = minusQty;
  op[1].onclick = plusQty;

  //summary
  const description = data.description.replace(/\s+/g, "<br/>");
  summary.innerHTML = `${data.note}<br/><br/>${data.texture}<br/>${description}<br/><br/>清洗：${data.wash}<br/>產地：${data.place}`;

  //story
  story.innerHTML = data.story;

  //images
  for (let i = 0; i < 2; i++){
    let img = document.createElement("img");
    img.src = data.images[i];
    img.setAttribute("alt", "product-picture");
    images.appendChild(img);
  }
  colorCode = data.colors[0].code;
  size = data.sizes[0];
  getColorStock(colorCode, size);
  stockRecord();
}
//1.選取顏色(classname加上current)
function selectColor(){
  let colorList = document.querySelectorAll(".color");
  for (let i = 0; i < colorList.length; i++){
    colorList[i].classList.remove("current");
  }
  this.classList.add("current");
  //初始化尺寸
  let sizeList = document.querySelectorAll(".size");
  for (let i = 0; i < sizeList.length; i++){
    sizeList[i].className = "size";
    sizeList[i].style.opacity = 1;
    sizeList[i].style.pointerEvents = 'auto';
  }
  sizeList[0].classList.add("current");
  //初始化數量
  qty = 1;
  value.textContent = qty;

  colorCode = this.getAttribute('style').slice(19);
  size=sizeList[0].getAttribute('textContent');
  

  console.log(colorCode);
  // console.log(size);

  getColorStock(colorCode, size);
  stockRecord();

  //add to cart
  // addToCart();
}

//2.選取到尺寸(classname加上current)
function selectSize(sizeIndex){
  let sizeList = document.querySelectorAll(".size");
  for (let i = 0; i < sizeList.length; i++){
    sizeList[i].classList.remove("current");
  }
  sizeList[sizeIndex].classList.add("current");
  //初始化數量
  qty = 1;
  value.textContent = qty;

  console.log(colorCode);
  size=sizeList[sizeIndex].getAttribute('textContent');
  console.log(size);

  getColorStock(colorCode, size ,"alreadySelect");
  stockRecord();
}
function minusQty(){
  if (qty > 1){
    qty = qty - 1;
  } else {
    qty = 1;
  }
  value.textContent = qty;
  stockRecord();
}

function plusQty(){
  if (qty < stock){
    qty = qty + 1;
    value.textContent = qty;
  }
  stockRecord();
}


//3.get stock data
function getColorStock(colorCode, size, alreadySelect){
  let colorAllSizes = [];
  for (let i = 0; i < variants.length; i++){
    if (colorCode === variants[i].color_code){
      //let data.variants.color_code becomes one color array
      colorAllSizes.push(variants[i]);
    }
  }
  // console.log(colorAllSizes);

  let selectSize = document.querySelectorAll("div.size");
  let selectableSize = [];
  for (let i = 0; i < colorAllSizes.length; i++){
    if (colorAllSizes[i].stock === 0){//if no stock ,let the div disable.
      selectSize[i].style.pointerEvents = "none";
      selectSize[i].style.opacity = 0.3;
      selectSize[i].classList.remove("current");
      //if the first size no stock, point to the next size.
    } else {
      selectableSize.push(selectSize[i]);
    }
  }
  console.log(size);
  // console.log(selectableSize);
  // console.log(selectSize);
  //  get stock data
  for (let i = 0; i < variants.length; i++){
    if (colorCode === variants[i].color_code && size === variants[i].size){
      stock = variants[i].stock;
      console.log(stock);
    }
  }

  //if the first size no stock, point to the next size.
  if (alreadySelect == "alreadySelect"){
    console.log("alreadySelect");
  } else {
    selectableSize[0].classList.add("current");
  }
  let autosize = sizes.querySelector(".current");
  console.log(autosize.textContent);
  for (let i = 0; i < colorAllSizes.length; i++){
    console.log("change stock");
    // console.log(autosize.textcontent);
    if (autosize.textContent === colorAllSizes[i].size){
      
      stock = colorAllSizes[i].stock;
      console.log(stock);
    }
  }
}


//4.stock record: set up max limit of quantity and update UI
let  hitCount= list.length;

function stockRecord(){
  console.log("stock:",stock, "qty:",qty);
  // let size = sizes.querySelector(".current");
  if (qty > stock){
    qty = stock;
    value.textContent = qty;
  }
  const cartButton = document.getElementById("product-add-cart-bn");
  cartButton.onclick = function () {
    window.alert("已加入購物車");
    hitCount = hitCount + 1;//按加入購物車按鈕時hitCount+1

    addToCart();

  }
}

/*
=================================================================
add product to cart
=================================================================
*/

function addToCart(){
  let item;
  // let restStock = stock - qty;
  item = {
    color: {
      code: colorCode,
      name: colors.querySelector(".current").name,
    },
    id: id.innerHTML,
    main_image: detailsData.main_image,
    name: name.innerHTML,
    price: price.innerHTML.slice(4),
    qty: qty,
    size: size,
    stock: stock,
    subtotal: price.innerHTML.slice(4) * qty,
  };
  list[hitCount - 1] = item;

  for (let i = 0; i < list.length - 1; i++){
    if (item.id === list[i].id && item.color.code === list[i].color.code && item.size === list[i].size){
      console.log(item.color.code)
      console.log(list[i].color.code)
      console.log(item.size)
      console.log(list[i].size)
      console.log("選購相同商品")
      if (list[i].stock >= qty ){
        console.log("庫存多餘欲購買總量，可放購物車")
        qty = list[i].qty + qty;
        console.log(qty);
        // stock = list[i].stock - qty;
      }
      hitCount = hitCount - 1;//商品重複，此筆count不計
      console.log(hitCount);
      console.log(list[i]);
      //移除原本的list[i];
      list.splice([i], 1);
    }
    
  }
  window.localStorage.setItem ("cart", JSON.stringify(cart));

  //改變購物車圖示的數字
  cartQty.textContent = list.length;
  cartQtyMobile.textContent = list.length;
  

}
getProductDetails(productId);