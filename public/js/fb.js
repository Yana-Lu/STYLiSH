//一載入頁面就呼叫fbInit()
window.onload = fbInit();

function fbInit(getToken) {
  window.fbAsyncInit = function () {
    FB.init({
      appId: '350508272833731',
      cookie: true,
      xfbml: true,
      version: 'v8.0'
    });

    FB.AppEvents.logPageView();

    FB.getLoginStatus(function (response) {

      if(response.status === 'connected'){
        console.log(response);
        let accesstoken = response.authResponse.accessToken;
        // console.log(accesstoken);
        //for cart.js CheckOut API
        if (typeof getToken == "function"){
          getToken(accesstoken);
        }
      }
    });
  };

  (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}

// 按會員按鈕時先檢查有沒有登入過
const memberBtns = document.getElementsByName("memberBtn");
console.log(memberBtns);
memberBtns.forEach((memberBtn)=> {
  memberBtn.addEventListener("click", () => {
    FB.getLoginStatus(function (response) {
      // console.log(response);
      if(response.status === 'connected'){
        console.log('你已經登入囉')
        console.log(response);
        let accesstoken = response.authResponse.accessToken;
        let auth = {
          "provider":"facebook",
          "access_token": accesstoken,
        };
        console.log(auth);
        getUserObject (auth);
        window.location = "./profile.html";
      }else{
        login();
      }
    });
  })
});

// 繼續未完成的登入
function login() {
  FB.login(function (response) {
    console.log(response);
  if (response.status === "connected") {

    // 如果已經登入了(response.status === "connected")，就使用FB.api"這個方法來獲得使用者的資料
      FB.api('/me', {
            'fields': 'id,name,email,picture.width(200).height(200)'
      }, function () {
        window.alert('您已經成功登入囉!')

      });
    }
  }, {
      scope: 'email',
      auth_type: 'rerequest'
    });
}

/*
response = {
    status: 'connected',  // connected (已登入FB與App) | not_authorized (已登入FB但未登入App) | unknown (未登入FB所以不知是否已登入App)
    authResponse: {
        accessToken: '...', // include user's access token
        expiresIn:'...',    // when will user need to login again
        signedRequest:'...',  // include user's information
        userID:'...'
    }
}
*/

/*
=======================================================================
check in API
=======================================================================
*/
function getUserObject (auth) {
  console.log(auth);
 const objectReq = new XMLHttpRequest();
 const src = 'https://api.appworks-school.tw/api/1.0/user/signin';
 objectReq.onreadystatechange = function () {
   if (objectReq.readyState === 4 && objectReq.status === 200) {
      let userObject = JSON.parse(objectReq.responseText);
      console.log (userObject);
   }
 };
 objectReq.open("POST", src, true);
 objectReq.setRequestHeader("Content-type","application/json");
 objectReq.send(JSON.stringify(auth));
}
