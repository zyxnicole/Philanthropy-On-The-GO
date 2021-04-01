
export const performAddNewForm = function(newPost) {
  return fetch('/items/', {
    method: 'POST',
    headers: new Headers({
      'content-type': 'application/json',
    }),
    body: JSON.stringify({newPost}),
  })
  .catch(() => {
    return Promise.reject({error: 'network-error'});
  })
  .then(convertError)
}

export const performDeletItem = function(itemId) {
  return fetch(`/items/${itemId}`, {
    method: 'DELETE',
  })
  .catch(() => {Promise.reject({error: 'network-error'})})
  .then(convertError)
}

export const performHomePage = function() {
  return fetch('/session/', {
    method:'GET',
  })
  .catch(() => Promise.reject({error: 'network-error'}))
  .then(convertError)
};

export const performMyPosts = function() {
  return fetch('/items/', {
    method:'GET',
  })
  .catch(() => Promise.reject({error: 'network-error'}))
  .then(convertError)
};

export const performDetail = function(item) {
  return fetch(`/items/${item.id}`, {
    method: 'GET'
  })
  .catch(() => {
    return Promise.reject({error: 'network-error'});
  })
  .then(convertError);
};

export const performLogin = function(uid) {
  return fetch('/session/', {
    method: 'POST',
    headers: new Headers({
      'content-type': 'application/json',
    }),
    body: JSON.stringify({uid}),
  })
  .catch(() => {
    return Promise.reject({error: 'network-error'});
  })
  .then(convertError)
};

export const performLogout = function() {
  return fetch('/session/', {
    method:'DELETE',
  })
  .catch(() => {
    return Promise.reject({error: 'network-error'});
  })
  .then(convertError)
};

function convertError(response) {
  if(response.ok) {
    return response.json();
  }
  return response.json().then(err => {
    console.log(err);
    Promise.reject(err)});
};
