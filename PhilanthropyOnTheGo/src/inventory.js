import {
  performDetail,
  performLogin,
  performLogout,
  performHomePage,
  performAddNewForm
} from './services';

import {
  showContent,
  showDetailPage,
  showNewPage,
} from './spa';

import {errMsgs} from './errMsgs';
import {googleAuth} from './firebase';
import firebase from "firebase/app";


'use strict';
(function iife() {
  const items = {};

  showHomePage();
  submitNewForm();
  postNew();
  backToHome();
  logOut();
  signIn();

  function showHomePage() {
    performHomePage()
    .then(res => {
      showContent(res.isLogIn);
      Object.values(res.storage).forEach(item => items[item.id] = item);
      renderHome(items);
      updatePageStatus('');

    })
    .catch(err => {
      updatePageStatus(errMsgs[err.error] || err.error);
    });
  };



  function renderHome(items) {
    const itemListEl = document.querySelector('#content .items-list');
    const html = Object.values(items).map((item, index) =>
    `
    <li class="single-item-list">
      <div class="item">
      <img src="image/avocado.jpg">
        <a class="link" data-index="${item.id}" href="#">
        ${item.store}
        </a>
      </div>
      <span>by: ${item.seller}</span>
    </li>
    `).join(" ");

    itemListEl.innerHTML = html;

    showDetailOnClickTitle();
  };

function showDetailOnClickTitle() {
  let titleList = document.querySelectorAll('#content .items-list li a');
  if (!titleList || titleList.length === 0) {
    return;
  }

  titleList.forEach(title =>
    title.addEventListener('click', (e) => {
      e.preventDefault();
      let action = e.target;
      if(action.classList.contains('link')) {
        const itemId = action.dataset.index;
        const item = items[itemId];

        showDetail(item);
      }
    })
  )}

  function showDetail(item) {
    performDetail(item)
    .then(item => {
      renderDetalPage(item);
      showDetailPage(item);
    })
    .catch(err => updatePageStatus(errMsgs[err.error] || err.error)
    )
  }


  function signIn () {
    document.querySelector('#header .sign-in').addEventListener('click', () => {
      googleAuth()
      .then(user => {
        const uid = user.uid;
        performLogin(uid)
        .then(response => {
          showContent(true);
          renderHome(items);
          updatePageStatus('');
        })
        .catch(err => {
          updateLogStatuse(errMsgs[err.error]);
        })
      });

    })
  }

  function renderDetalPage(item) {
    const detailEl = document.querySelector('#detail .items-detail');
    const html =
    `
      <div class="item">
        <div class='header'></div>
        <div class="store" data-index="${item.id}">
          <br>
          ${item.store}
        </div>
        <div class="seller">
          by: ${item.seller}
          <span>phone: ${item.phone}</span>
        </div>

        <div class="location">
          <span>Location: </span>
          <br>
          ${item.location}
        </div>
        <div class="item-content">
          <span>Items: </span>
          <br>
          ${item.item}
        </div>
      </div>
      `;
    detailEl.innerHTML = html;
  }

  function postNew() {
    document.querySelector('#header .post' ).addEventListener('click', (e) => {
      showNewPage();
    })
  }


  function submitNewForm() {
    document.querySelector('#new .submit').addEventListener('click', () => {
      const store = document.querySelector('#new .new-store input');
      const phone = document.querySelector('#new .new-phone input')
      const location = document.querySelector('#new .new-location textarea');
      const content = document.querySelector('#new .new-content textarea');
      const seller = document.querySelector('#new .new-name input');

      const newPost= {
        store: store.value,
        phone: phone.value,
        location: location.value,
        item: content.value,
        seller : seller.value,
      }


      performAddNewForm(newPost)
      .then(item => {   
        items[item.id] = item;
        showDetail(item);
        store.value = '';
        phone.value = ''
        location.value = '';
        content.value = '';
      })
      .catch(err => {
        updateNewFormStatuse(errMsgs[err.error]);
      })
    })
  }


  function backToHome() {
    let backs = document.querySelectorAll('.back');
    if (!backs || backs.length === 0) {
      return;
    }
    backs.forEach(back =>
      back.addEventListener('click', (e) => {
        showHomePage();
      })
    )
  }

  function logOut() {
    document.querySelector('#header .logout').addEventListener('click', () => {

      firebase.auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        performLogout()
          .then(unused => {
            showContent(false);
            renderHome(items);
            updatePageStatus('');
          })
          .catch(err => {
            updatePageStatuse(errMsgs[err.error] || err.error);
          })
        })
      .catch((error) => {
        // An error happened.
      });
    });
  }


  function updateLogStatuse(message) {
    const logStatus = document.querySelector('#header .logStatus');
    logStatus.innerText = message;
  };

  function updatePageStatus(message) {
    const pageStatus = document.querySelector('#detail .status');
    pageStatus.innerText = message;
  };

  function updateNewFormStatuse(message) {
    const newFormStatus = document.querySelector('#new .status');
    newFormStatus.innerText = message;
  };


}());
