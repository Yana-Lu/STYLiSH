import { localStorage } from './common.js';
// import { getFbData } from './fbprofile.js';


// get and render cart data
localStorage();
let cart = JSON.parse(window.localStorage.getItem('cart'));
let list = cart.list;
let cartQty = document.getElementById('cart-qty');
let cartQtyMobile = document.getElementById('cart-qty-mobile');
cartQty.textContent = list.length;
cartQtyMobile.textContent = list.length;

//render Fb data
/*eslint no-undef: 0*/
// getEbData has been defined in fbprofile.js
getFbData(signIn);
function signIn (auth) {
  console.log(auth);
  const req = new XMLHttpRequest();
  const src = 'https://api.appworks-school.tw/api/1.0/user/signin';
  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
      let memberInfo = JSON.parse(req.responseText);
      renderProfile(memberInfo);
    }
  };
  req.open("POST", src, true);
  req.setRequestHeader("Content-type","application/json");
  req.send(JSON.stringify(auth));
}



function renderProfile(res){
  console.log(res);
  const infoTitle = document.querySelector("h2");
  infoTitle.textContent = "會員資料";
  // const avatar = document.querySelector(".avatar");
  // const avatarImg = document.createElement("img");
  // avatarImg.className = "picture";
  // avatarImg.src = res.data.user.picture.url;
  // avatar.appendChild(avatarImg);
  const name = document.querySelector(".name");
  name.textContent = res.data.user.name;
  const email = document.querySelector(".email");
  email.textContent = res.data.user.email;
  const logontBtn = document.querySelector("#logout");
  logontBtn.textContent = "登出";
}

//log out feature
const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", function() {
  // //按登出按鈕時先檢查狀態是否為登入
  FB.getLoginStatus(function (response) {
    console.log(response.status);
    if(response.status === 'connected') {
     FB.logout(function () {
        window.localStorage.clear();
        console.log("log out");
        // window.alert("您已經成功登出囉!");
        // window.location = "./index.html";
        window.location.href = "./";
      });
    }
  });
});
