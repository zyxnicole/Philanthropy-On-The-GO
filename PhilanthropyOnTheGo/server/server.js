const express = require('express');
const uuid = require('uuid').v4;
const cookiePaser = require('cookie-parser');
const bodyPaser = require('body-parser');;
const userPosts= require('./user-posts');  //change my posts stuff, input contact name  logout
const storage = require('./storage');

const app = express();
const PORT = 3000;

const sessions = {};

app.use(cookiePaser());
app.use(bodyPaser());
app.use(express.static('./public'));

app.get('/session/', (req, res) => {
  let isLogIn = true;
  const sid = req.cookies.sid;

  if(!sid || !sessions[sid]) {
    res.clearCookie('sid');
    isLogIn = false;
  }

  res.status(200).json({isLogIn : isLogIn, storage : storage});
})

app.get('/items/', (req, res) => {
  let isLogIn = true;
  const sid = req.cookies.sid;
  const uid = sessions[sid].uid;
  if(!sid || !sessions[sid]) {
    res.clearCookie('sid');
    delete sessions[sid];
    isLogIn = false;
    res.status(400).json({error:'missing-name'});
  }
  res.status(200).json({isLogIn : isLogIn, userPosts : userPosts[uid]});
})

app.get('/items/:itemId', express.json(), (req, res) => {
  let itemId = req.params.itemId;
  if(!itemId) {
    res.status(400).json({error:'missing-item'});
    return
  }
  const item = storage[itemId];
  res.status(200).json(item);
})

app.delete('/items/:itemId', express.json(), (req, res) => {
  let itemId = req.params.itemId;

  if(!itemId) {
    res.status(400).json({error:'missing-item'});
    return
  }

  let sid = req.cookies.sid;
  const uid = sessions[sid].uid;

  delete storage[itemId];
  delete userPosts[uid][itemId];

  res.status(200).json({});
})

app.post('/session/', (req, res) => {
  const {uid} = req.body;

  if(!uid) {
    res.status(403).json('missing-user');
    return;
  }
  const sid = uuid();
  sessions[sid] = {uid};
  res.cookie('sid', sid);
  res.status(200).json({});
})

app.delete('/session/', (req, res) => {
  const sid = req.cookies.sid;
  if(sid) {
    delete sessions[sid];
    res.clearCookie('sid');
    res.status(200).json({});
  }
})

app.post('/items/',(req, res) => {
  const newPost = req.body.newPost;
  const sid = req.cookies.sid;
  let store = encode(newPost.store);
  let location = encode(newPost.location);
  let item = encode(newPost.item);
  let phone = encode(newPost.phone);
  let seller = encode(newPost.seller);

  const phoneError = validatePhoneNumber(phone);

  const nameError = validateUsername(seller);

  if(phoneError) {
    res.status(400).json({error});
    return;
  }

  if(nameError) {
    res.status(400).json({error});
    return;
  }

  if(!store || !location || !item || !phone || !seller) {
     res.status(403).json({error:'empty'})
  } else {

    const id = uuid();

    storage[id] = {};
    storage[id].store = store;
    storage[id].location = location;
    storage[id].item = item;
    storage[id].phone = phone;
    storage[id].id = id;
    storage[id].seller = seller;

    const uid = sessions[sid].uid;

    if (!userPosts[uid]) {
      userPosts[uid] = {};
    }

    userPosts[uid][id] = {
      id : id,
      seller : seller,
      store : store,
      location : location,
      phone : phone,
      item : item,
    };

    res.status(200).json(storage[id]);
}
})


function validateUsername(seller) {
  const errors = [];
  const clean = seller.replace(/[^A-Za-z0-9_]+/g, '');
  if( clean !== seller) {
    return 'invalid-name';
  }
  if(!seller) {
    return 'empty';
  }
  return '';
};

function validatePhoneNumber(phone) {
  const errors = [];
  const clean = phone.replace(/[^0-9]+/g, '');
  if( clean !== phone) {
    return 'invalid-number';
  }
  return '';
};


function encode(string) {
  if (!string) {
    return string;
  }
  return string
      .replace(/&/g, "&amp;")
      .replace(/>/g, "&gt;")
      .replace(/</g, "&lt;")
}


app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
