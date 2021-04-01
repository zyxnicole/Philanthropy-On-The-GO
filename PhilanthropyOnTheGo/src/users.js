'use strict';
import {
  performLogout,
  performDeletItem,
  performMyPosts,
  performDetail,
  performAddNewForm
} from './services';

import {
  showContent,
  showDetailPage,
  showNewPage,
} from './spa';

import {errMsgs} from './errMsgs';
import firebase from "firebase/app";

(function iife() {
  const items = {};

  showMyPosts();
  postNew();
  submitNewForm();
  logOut();
  backToHome();
 

  function showMyPosts()  {
    performMyPosts()
    .then(res => {
      showContent(res.isLogIn);
      Object.values(res.userPosts).forEach(item => items[item.id] = item);
      renderPostsPage(items);
      updateLogStatuse()('');
    })
    .catch(err => {
      updateLogStatuse(errMsgs[err.error] || err.error);
    });
  }

  function renderPostsPage(items) {
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
        deleteItem(itemId);
      }
    })
  )}

  function showDetail(item) {
    performDetail(item)
    .then(item => {
      renderDetalPage(item);
      showDetailPage(item);
    })
    .catch(err => {
      updatePageStatus(errMsgs[err.error] || err.error);
    })
  }

  function postNew() {
    document.querySelector('#header .post' ).addEventListener('click', (e) => {
      showNewPage();
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

  function logOut() {
    document.querySelector('#header .logout').addEventListener('click', () => {
      performLogout()
      .then(unused => {
        showContent(false);
        renderHome(items);
        updateLogStatuse()('');
      })
      .catch(err => {
        updateLogStatuse()(errMsgs[err.error] || err.error);
      })
    });
  };

  function deleteItem(itemId) {
    const itemListEl = document.querySelector('#detail .detail-page .delete');
    itemListEl.addEventListener('click', (e) => {
        performDeletItem(itemId)
        .then(res => {
          delete items[itemId];
          renderPostsPage(items);
          showMyPosts();
        })
        .catch(err => {
          updatePageStatuse(errMsgs[err.error] || err.error);
        });
    });
  }

  function backToHome() {
    let backs = document.querySelectorAll('.back');
    if (!backs || backs.length === 0) {
      return;
    }
    backs.forEach(back =>
      back.addEventListener('click', (e) => {
        showMyPosts();
      }));
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
        seller.value = '';
      })
      .catch(err => {
        updateNewFormStatuse(errMsgs[err.error] || err.error);
      })
    })
  }

  function updateLogStatuse(message) {
    const logStatus = document.querySelector('#header .logStatus');
    logStatus.innerText = message;
  };

  function updatePageStatus(message) {
    const pageStatus = document.querySelector('#detail .logStatus');
    pageStatus.innerText = message;
  };

  function updateNewFormStatuse(message) {
    const newFormStatus = document.querySelector('#new .status');
    newFormStatus.innerText = message;
  };

}());
