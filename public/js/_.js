let promptInitialized = false;

const _ = {
  manageServer: (sid, option) => (
    fetch(`/chat/${option}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sid })
    }).then((res) => res.json())
  ),
  alert: (msg, isError = false, delay = 600) => {
    setTimeout(() => {
      const alert = document.querySelector('#alert');

      alert.innerHTML = msg;
      if (isError && !alert.classList.contains('error')) alert.classList.add('error');
      else if (!isError && alert.classList.contains('error')) alert.classList.remove('error');
  
      alert.classList.add('active');
      setTimeout(() => alert.classList.remove('active'), 2500);
    }, delay);
  },
  prompt: function (type) {
    const prompt = document.querySelector(`#${type}.prompt-ex`);
    const alert = this.alert;
    const manageServer = this.manageServer;

    function promptInit() {
      const clearInput = () => setTimeout(() => document.querySelector('.prompt-content > form input[type=text]').value = '', 600);
      document.querySelectorAll('.prompt-ex').forEach((prompt) => {
        prompt.querySelector('.prompt-control > input[type=button].standard').addEventListener('click', (event) => {
          event.target.parentElement.parentElement.parentElement.classList.remove('active');
          clearInput();
        });

        prompt.addEventListener('click', (event) => {
          if (event.target.classList.contains('prompt-ex')) {
            prompt.classList.remove('active');
            clearInput();
          }
        });
      });

      if (type === 'join-server') {
        const sidForm = prompt.querySelector('.prompt-content > form');
        const joinButton = prompt.querySelector('.prompt-control > input[type=button].save');

        const handleJoin = (event) => {
          event.preventDefault();

          const sid = new FormData(sidForm).get('sid').trim();

          if (sid.length === 10) {
            manageServer(sid, 'join').then(async (res) => {
              (await res.json()) ? alert('Successfully joined server!') : alert('Error: Check if the SID is valid.', true);
            });
          } else {
            alert('Error: Check if the SID is valid.', true);
          }

          prompt.classList.remove('active');
          clearInput();
        }

        sidForm.addEventListener('submit', handleJoin);
        joinButton.addEventListener('click', handleJoin);
      }

      promptInitialized = true;
    }

    if (!promptInitialized) promptInit();
    prompt.classList.add('active');
  },
  format: {
    message: ({ username, content, time }) => {
      return `
      <li class="message">
        <div class="info">
          <div class="username">${username}</div>
          <span class="time">${time}</span>
        </div>
        <div class="content">${content}</div>
      </li>`;
    },
    server: ({ sid, name, icon }) => {
      return `
      <li id="${sid}" class="server preview" name="${name}">
        <ion-icon name="${icon}"></ion-icon>
      </li>`;
    },
    channel: ({ id, username }) => {
      return `
      <li id="${id}" class="channel">
        <div class="name">${username}</div>
        <div class="preview">
          You: Welcome to Connat!
          <span>3h</span>
        </div>
      </li>`;
    }
  }
}