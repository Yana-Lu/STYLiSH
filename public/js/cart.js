//從common匯出的function
import { localStorage } from './common.js'
localStorage()
//新頁面先抓localStorage的紀錄
let cart = JSON.parse(window.localStorage.getItem('cart'))
let list = cart.list
let cartQty = document.getElementById('cart-qty')
let cartQtyMobile = document.getElementById('cart-qty-mobile')

//cart qty
cartQty.textContent = list.length
cartQtyMobile.textContent = list.length

let freight = 0
const confirmPay = document.querySelector('#checkout')
const listItems = document.querySelector('.list')

// loading
import { showLoading } from './common.js'
import { hideLoading } from './common.js'

//get Token
// import { fbInit } from './fb.js';

/*
=================================================================
Check item in the cart.
=================================================================
*/

//確認購物車裡有沒有商品
function checkCart() {
  let cart = JSON.parse(window.localStorage.getItem('cart'))
  let list = cart.list
  if (list.length == 0) {
    console.log('1')
    //重新抓一次localStorage的資料
    let cart = JSON.parse(window.localStorage.getItem('cart'))
    let list = cart.list
    cartQty.textContent = list.length
    cartQtyMobile.textContent = list.length

    let cartIsEmpty = document.createElement('div')
    cartIsEmpty.className = 'empty'
    cartIsEmpty.textContent = '購物車空空的耶'
    cartIsEmpty.style.height = '60px'
    cartIsEmpty.style.lineHeight = '60px'
    cartIsEmpty.style.textAlign = 'center'
    listItems.appendChild(cartIsEmpty)
    freight = 0
    confirmPay.style.pointerEvents = 'none'
    confirmPay.style.opacity = '0.3'
    cart.freight = 0
    window.localStorage.setItem('cart', JSON.stringify(cart))
  }
}
checkCart()
//有商品，印出List內容

function renderCartData() {
  //重新抓一次localStorage的資料
  let cart = JSON.parse(window.localStorage.getItem('cart'))
  let list = cart.list
  cartQty.textContent = list.length
  cartQtyMobile.textContent = list.length
  let subtotal

  for (let i = 0; i < list.length; i++) {
    let row = document.createElement('div')
    row.className = 'row'
    listItems.appendChild(row)

    let variant = document.createElement('div')
    variant.className = 'variant'
    row.appendChild(variant)

    let picture = document.createElement('div')
    picture.className = 'picture'
    variant.appendChild(picture)

    let mainImg = document.createElement('img')
    mainImg.src = list[i].main_image
    mainImg.setAttribute('alt', 'product-picture')
    picture.appendChild(mainImg)

    let detailes = document.createElement('div')
    detailes.className = 'detailes'
    detailes.innerHTML = `${list[i].name}<br>${list[i].id}<br><br>顏色：${list[i].color.name}<br>尺寸：${list[i].size}`
    variant.appendChild(detailes)

    let qty = document.createElement('div')
    qty.className = 'qty'
    row.appendChild(qty)

    let select = document.createElement('select')
    select.className = 'select'
    select.classList = '.select'
    for (let j = 0; j < list[i].stock; j++) {
      let option = document.createElement('option')
      option.value = j + 1
      option.textContent = j + 1
      if (option.value == list[i].qty) {
        //option帶有屬性seleced,select選單顯示option的value
        option.selected = 'selected'
      }
      select.appendChild(option)
    }
    select.onchange = changeQty
    select.id = `select${i}`
    qty.appendChild(select)

    //單價
    let price = document.createElement('div')
    price.className = 'price'
    price.textContent = `NT.${list[i].price}`
    row.appendChild(price)

    //小計
    subtotal = document.createElement('div')
    subtotal.className = 'subtotal number'
    subtotal.textContent = `NT.${list[i].subtotal}`
    row.appendChild(subtotal)

    let remove = document.createElement('div')
    let removeImg = document.createElement('img')
    remove.className = 'remove'
    remove.id = `remove${i}`
    removeImg.src = './images/cart-remove.png'
    remove.onclick = removeItem
    remove.appendChild(removeImg)
    row.appendChild(remove)
    // console.log(remove.id);
  }

  //更改商品數量
  function changeQty() {
    let renewQty = this.value
    let selectIndex = this.id.slice(6)
    list[selectIndex].qty = renewQty
    // console.log(selectIndex);
    list[selectIndex].subtotal = list[selectIndex].price * renewQty
    window.localStorage.setItem('cart', JSON.stringify(cart))
    //更改小計
    let subtotalAll = document.querySelectorAll('.number')
    //找到選擇對應的subtotal
    subtotalAll[selectIndex].textContent = `NT.${list[selectIndex].subtotal}`
    // console.log(subtotal.textContent);
    calculatePay()
  }
}
renderCartData()

//移除商品
function removeItem() {
  let removeIndex = this.id.slice(6)
  console.log(removeIndex)
  // renew data
  cart = JSON.parse(window.localStorage.getItem('cart'))
  cart.list.splice(removeIndex, 1)
  window.localStorage.setItem('cart', JSON.stringify(cart))
  window.alert('已從購物車中移除')
  //清掉畫面中的商品
  let listClear = document.querySelector('.list')
  listClear.innerHTML = ' '
  console.log(listClear)

  checkCart()
  renderCartData()
  calculatePay()
}
/*
=================================================================
Choose shipping & payment
=================================================================
*/
let area = document.querySelector('.area')
cart.shipping = area.value
console.log(cart.shipping)
area.onchange = function () {
  cart.shipping = this.value
}

let payment = document.querySelector('.payment')
cart.payment = payment.value
console.log(cart.payment)
payment.onchange = function () {
  cart.payment = this.value
}

/*
=================================================================
Show subtotal. freight & total 
=================================================================
*/
function calculatePay() {
  let priceSum = 0
  let cart = JSON.parse(window.localStorage.getItem('cart'))
  let list = cart.list

  for (let i = 0; i < list.length; i++) {
    priceSum = priceSum + list[i].subtotal
  }
  if (list.length !== 0) {
    freight = 60
  }
  let total = priceSum + freight
  //存回cart
  cart.subtotal = priceSum
  cart.freight = freight
  cart.total = total
  window.localStorage.setItem('cart', JSON.stringify(cart))
  //顯示在畫面上
  let subtotalContent = document.getElementById('subtotal')
  let freightContent = document.getElementById('freight')
  let totalContent = document.getElementById('total')
  subtotalContent.textContent = priceSum
  freightContent.textContent = freight
  totalContent.textContent = total
  // console.log(cart);
}
calculatePay()

/*
=================================================================
1.判斷輸入格式
2.必填項目未填時，通知未填項目
=================================================================
*/
const recipient = document.querySelector('.recipient')
let inputRecipient = recipient.querySelectorAll('input[type="text"]')

//判斷Email格式

let isEmail = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
inputRecipient[1].addEventListener('blur', () => {
  if (isEmail.test(inputRecipient[1].value)) {
    console.log('Email格式正確')
  } else {
    window.alert('請輸入正確Email格式')
  }
})
//判斷手機格式
let isMobNumber = /^09\d{8}$/
inputRecipient[2].addEventListener('blur', () => {
  if (isMobNumber.test(inputRecipient[2].value)) {
    console.log('手機號碼格式正確')
  } else {
    window.alert('請輸入正確手機號碼格式')
  }
})

confirmPay.addEventListener('click', (event) => {
  if (inputRecipient[0].value == false) {
    window.alert('請輸入收件人姓名')
  } else if (inputRecipient[1].value == false) {
    window.alert('請輸入email')
  } else if (inputRecipient[2].value == false) {
    window.alert('請輸入手機號碼')
  } else if (inputRecipient[3].value == false) {
    window.alert('請輸入收件地址')
  }

  function recipientData(item) {
    let itemValue = document.querySelector(`input[id="recipient-${item}"]`).value
    cart.recipient[item] = itemValue
    console.log(itemValue)
  }
  for (let i = 0; i < inputRecipient.length; i++) {
    recipientData('name')
    recipientData('email')
    recipientData('phone')
    recipientData('adress')
  }
  console.log(inputRecipient.length)
  window.localStorage.setItem('cart', JSON.stringify(cart))
  //送出信用卡資料
  onSubmit(event)
})

let time = document.getElementsByName('recipient-time')
recipient.addEventListener('click', () => {
  for (let i = 0; i < time.length; i++) {
    if (time[i].checked == true) {
      cart.recipient.time = time[i].value
      console.log(cart.recipient.time)
    }
  }
  window.localStorage.setItem('cart', JSON.stringify(cart))
})

/*
=================================================================
Introduction to TapPay
=================================================================
*/

// 設置好GetPrime 所需要的金鑰(appID, appKey, serverType)
//測試時使用 Sandbox 環境 (‘sandbox’)
TPDirect.setupSDK('12348', 'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF', 'sandbox')

// 把 TapPay 內建輸入卡號的表單給植入到 div 中
TPDirect.card.setup({
  fields: {
    number: {
      // css selector
      element: '#card-number',
      placeholder: '**** **** **** ****',
    },
    expirationDate: {
      // DOM object
      element: document.getElementById('card-expiration-date'),
      placeholder: 'MM / YY',
    },
    ccv: {
      element: '#card-ccv',
      placeholder: 'ccv',
    },
  },

  styles: {
    // Style all elements
    input: {
      color: 'gray',
    },
    // Styling ccv field
    'input.ccv': {
      // 'font-size': '16px'
    },
    // Styling expiration-date field
    'input.expiration-date': {
      // 'font-size': '16px'
    },
    // Styling card-number field
    'input.card-number': {
      // 'font-size': '16px'
    },
    // style focus state
    ':focus': {
      // 'color': 'black'
    },
    // style valid state
    '.valid': {
      color: 'green',
    },
    // style invalid state
    '.invalid': {
      color: 'red',
    },
    // Media queries
    // Note that these apply to the iframe, not the root window.
    '@media screen and (max-width: 400px)': {
      input: {
        color: 'orange',
      },
    },
  },
})

let prime
function onSubmit(event) {
  event.preventDefault()

  // 取得 TapPay Fields 的 status
  const tappayStatus = TPDirect.card.getTappayFieldsStatus()

  // 確認是否可以 getPrime
  if (tappayStatus.canGetPrime === false) {
    alert('信用卡資訊填寫錯誤')
    return
  }

  // Get prime
  TPDirect.card.getPrime((result) => {
    if (result.status !== 0) {
      alert('傳送失敗')
      return
    }
    // alert('get prime 成功，prime: ' + result.card.prime)
    prime = result.card.prime
    console.log(`成功!prime=${prime}`)
    // send prime to your server, to pay with Pay by Prime API .
    // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    prepareOrder(prime)
    checkout(order, getCheckout)
  })
}

/*
=================================================================
Check out API
=================================================================
*/
//Prepare Order Data
let order
cart = JSON.parse(window.localStorage.getItem('cart'))
// console.log(cart);
function prepareOrder(prime) {
  order = {
    prime: prime,
    order: {
      shipping: 'delivery',
      payment: 'credit_card',
      subtotal: cart.subtotal,
      freight: cart.subtotal.freight,
      total: cart.total,
      recipient: {
        name: cart.recipient.name,
        phone: cart.recipient.phone,
        email: cart.recipient.email,
        address: cart.recipient.adress,
        time: cart.recipient.time,
      },
      list: cart,
    },
  }
  //Show loding div
  showLoading()
}
// checkout(order);

//Send Ajax Request
//
// fbInit(takeToken);
// let accesstoken;
// function takeToken(auth) {
//   console.log(1, auth);
//   // accesstoken = auth;
// };

/*eslint no-undef: 0*/
fbInit(getToken)
let accessToken
function getToken(accesstoken) {
  // console.log(accesstoken);
  accessToken = accesstoken
}

function checkout(orderData, callback) {
  console.log(accessToken)
  console.log(orderData)
  const orderRequest = new XMLHttpRequest()
  const src = 'https://api.appworks-school.tw/api/1.0/order/checkout'
  orderRequest.onreadystatechange = function () {
    if (orderRequest.readyState === 4 && orderRequest.status === 200) {
      //Hide loding div
      hideLoading()
      callback(JSON.parse(this.responseText))
      //清掉localStorage的資料
      window.localStorage.clear()
    } else if (orderRequest.readyState === 4 && orderRequest.status === 400) {
      hideLoading()
      alert('沒有回應')
    }
  }
  orderRequest.open('post', src, true)
  orderRequest.setRequestHeader('Content-type', 'application/json')
  //如果有sign in，把accessToken加進來
  if (accessToken) {
    orderRequest.setRequestHeader('Authorization', `Bearer ${accessToken}`)
  }
  orderRequest.send(JSON.stringify(orderData))
}

let productNumber
function getCheckout(data) {
  //取得訂單編號
  console.log(data)
  productNumber = data.data.number
  //跳到感謝頁
  window.location = `./thank.html?number=${productNumber}`
}
