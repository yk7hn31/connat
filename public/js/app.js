const serverList = document.getElementById('side');
const channelList = document.getElementById('channel-list');

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
});

// chatPh.addEventListener('click', (event) => {
//   _.prompt('join-server');
// });