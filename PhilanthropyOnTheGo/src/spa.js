export const showDetailPage = function() {
    document.querySelector('#header .login').classList.add('hidden');
    document.querySelector('#new .new-post').classList.add('hidden');
    document.querySelector('#header .header').classList.add('hidden');
    document.querySelector('#content .content').classList.add('hidden');
    document.querySelector('#detail .detail-page').classList.remove('hidden');
  }

  export const showNotLogin = function() {
    document.querySelector('#header .login').classList.remove('hidden');
    document.querySelector('#header .loggedIn').classList.add('hidden');
  };

  export const showLoggedIn = function() {
    document.querySelector('#header .login').classList.add('hidden');
    document.querySelector('#header .loggedIn').classList.remove('hidden');
  }

  export const showNewPage = function() {
    document.querySelector('#header .login').classList.add('hidden');
    document.querySelector('#new .new-post').classList.remove('hidden');
    document.querySelector('#header .header').classList.add('hidden');
    document.querySelector('#content .content').classList.add('hidden');
    document.querySelector('#detail .detail-page').classList.add('hidden');
  }

  export const showContent = function(isLogIn) {
    document.querySelector('#new .new-post').classList.add('hidden');
    document.querySelector('#header .header').classList.remove('hidden');
    document.querySelector('#content .content').classList.remove('hidden');
    document.querySelector('#detail .detail-page').classList.add('hidden');
    if(isLogIn) {
      showLoggedIn();
    } else {
      showNotLogin();
    }
  }