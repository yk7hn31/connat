const chatPh = document.getElementById('chat-ph');
const serverList = document.getElementById('server-list');

fetch('/chat/list', { method: 'POST' }).then(async (res) => {
  const serverInfoList = await res.json();

  serverInfoList.forEach((info) => {
    serverList.insertAdjacentHTML('beforeend', _.format.server(info));
  });
});

chatPh.addEventListener('click', (event) => {
  _.prompt('join-server');
});