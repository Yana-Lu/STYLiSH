/*eslint no-unused-vars: 0*/
// getEbData has been used in profile.js
function getFbData (handleResponse){
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
        console.log('你已經登入囉');
        let accesstoken = response.authResponse.accessToken;
        let auth = {
          "provider":"facebook",
          "access_token": accesstoken,
        };
        handleResponse(auth);
          FB.api('/me', 
          {
            'fields': 'id,name,email,picture.width(200).height(200)'
          }, 
          function (response) {
            console.log(response);
            //render user's data
            const avatar = document.querySelector(".avatar");
            const avatarImg = document.createElement("img");
            avatarImg.className = "picture";
            avatarImg.src = response.picture.data.url;
            avatarImg.setAttribute("alt", "avatar-picture");
            avatar.appendChild(avatarImg);
          });
      }
      else{
        window.alert('您還沒登入喔')
        window.location.href = "./";
        // login();
      }
    });
  };

  // Load the SDK asynchronously
  (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
  
}

//打包 log in funtion 並 export
// 繼續未完成的登入
// export function login() {
//   FB.login(function (response) {
//     console.log(response);
//   if (response.status === "connected") {
//     // 如果已經登入了(response.status === "connected")，就使用"FB.api"這個方法來獲得使用者的資料
//       FB.api('/me', {
//         'fields': 'id,name,email,picture'
//       }, function (response) {
//         console.log(response);
//       });
//     }
//   }, {
//       scope: 'email',
//       auth_type: 'rerequest'
//     });
// }

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

