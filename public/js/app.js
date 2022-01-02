import { _ } from '/js/_.js';

const socket = io();

const serverList = document.getElementById('side');
const mainContent = document.querySelector('#content > main');
const channelList = document.getElementById('channel-list');
const messageList = document.getElementById('message-list');
const chatForm = document.getElementById('chat-input');
const signOut = document.querySelector('#content > header > input[type=button]');

const username = document.body.getAttribute('user');

async function getServerList() {
  return fetch('/chat/server/list', { method: 'POST' }).then(async (res) => {
    let serverElements = '';
    (await res.json()).forEach((info) => serverElements += _.format.server(info));
    serverList.insertAdjacentHTML('beforeend', serverElements);
  });
}

async function getDMList() {
  return fetch('/chat/dm/list', { method: 'POST' }).then(async (res) => {
    let channelElements = '';
    (await res.json()).forEach((info) => channelElements += _.format.channel(info));
    channelList.innerHTML =  channelElements;
  });
}

function initChannels() {
  channelList.querySelectorAll('.channel').forEach((channel) => {
    channel.addEventListener('click', (event) => {
      const activeChannel = channelList.querySelector('.active');
      let id;
      
      if (event.target.classList.contains('name')) id = event.target.parentElement.id;
      else if (event.target.classList.contains('channel')) id = event.target.id;
      else return;
  
      if (activeChannel && activeChannel.id === id) return;
  
      if (activeChannel) activeChannel.classList.remove('active');
      document.getElementById(id).classList.add('active');
  
      if (serverList.querySelector('.active').id === 'direct-message') {
        socket.emit('joinDM', { username, room: id });
  
        fetch('/chat/dm/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        }).then(async (res) => {
          const msgHistory = await res.json();
          let result = '';
          let prevUsername, prevTime;

          msgHistory.forEach((message) => {
            if (prevUsername === message.username && prevTime === message.time) result += _.format.message(message, false, true);
            else result += _.format.message(message);
            prevUsername = message.username;
            prevTime = message.time;
          });
  
          mainContent.querySelectorAll('.hidden-hard').forEach((element) => element.classList.remove('hidden-hard'));
          document.getElementById('placeholder').classList.add('hidden-hard');
          messageList.innerHTML = result;

          messageList.scrollTop = messageList.scrollHeight;
        });
      }
    });
  });
}

getServerList();
getDMList().then(initChannels);

signOut.addEventListener('click', () => {
  fetch('/account/signout', { method: 'DELETE' }).then(() => {
    _.alert('Successfully signed out. Redirecting you in 5 seconds...', false);
    setTimeout(() => location.href = '/account/signin', 4500);
  });
});

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const content = new FormData(chatForm).get('message');
  if (content.trim()) socket.emit('clientMessage', { content, username });
});

socket.on('serverMessage', (data) => {
  chatForm.querySelector('input[type=text]').value = '';
  messageList.insertAdjacentHTML('beforeend', _.format.message(data, true));
  messageList.scroll({ top: messageList.scrollHeight, behavior: 'smooth' });
});