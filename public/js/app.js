fetch('/channel/list', { method: 'POST' }, async (res) => {
  const channelList = await res.json();

  console.log(channelList);
});