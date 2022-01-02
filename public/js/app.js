const socket = io();

const serverList = document.getElementById('side');
const mainContent = document.querySelector('#content > main');
const channelList = document.getElementById('channel-list');
const messageList = document.getElementById('message-list');
const chatForm = document.getElementById('chat-input');

const username = document.body.getAttribute('user');

fetch('/chat/server/list', { method: 'POST' }).then(async (res) => {
  const serverInfoList = await res.json();

  serverInfoList.forEach((info) => {
    serverList.insertAdjacentHTML('beforeend', _.format.server(info));
  });
});

fetch('/chat/dm/list', { method: 'POST' }).then(async (res) => {
  const dmInfoList = await res.json();

  dmInfoList.forEach((info) => {
    channelList.insertAdjacentHTML('beforeend', _.format.channel(info));
  });
}).then(() => {
  channelList.querySelectorAll('.channel').forEach((channel) => {
    channel.addEventListener('click', (event) => {
      const activeChannel = channelList.querySelector('.active');
      let id;
      
      if (event.target.tagName === 'SPAN') id = event.target.parentElement.parentElement.id;
      else if (event.target.classList.contains('name') || event.target.classList.contains('preview')) id = event.target.parentElement.id;
      else id = event.target.id;

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

          msgHistory.forEach((message) => {
            result += _.format.message(message);
          });

          messageList.innerHTML = result;
          messageList.scrollTop = messageList.scrollHeight;
        });
      }

      mainContent.querySelectorAll('.hidden-hard').forEach((element) => element.classList.remove('hidden-hard'));
      document.getElementById('placeholder').classList.add('hidden-hard');
    });
  });
});

chatForm.addEventListener('submit', (event) => { // NOTE: Written on assumption of DM
  event.preventDefault();
  const content = new FormData(chatForm).get('message');

  if (content) socket.emit('clientMessage', { content, username });
});

socket.on('serverMessage', (data) => {
  chatForm.querySelector('input[type=text]').value = '';
  messageList.insertAdjacentHTML('beforeend', _.format.message(data));
  messageList.scrollTop = messageList.scrollHeight;
});

// chatPh.addEventListener('click', (event) => {
//   _.prompt('join-server');
// });