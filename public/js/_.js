let promptInitialized = false;

const _ = {
  newCh: (invitee, isDirectMessage) => { // if `isDirectMessage` is false, set `invitee` to null
    fetch('/server/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invitee, isDirectMessage })
    }).then(async (res) => {
      const result = await res.text();
      console.log(`A new server (#${result}) has been successly created.`);
    });
  },
  manageCh: (sid, option) => (
    fetch(`/server/${option}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sid })
    }).then((res) => res.json())
  ),
  dummy: (un, pw = 'password') => {
    fetch('/account/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ un, pw })
    }).then(() => {
      console.log(`A new dummy account ${un} has been successfully created.`);
    });
  },
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
  signOut: () => fetch('/account/signout', { method: 'DELETE' }),
  prompt: function (type) {
    const prompt = document.querySelector(`#${type}.prompt-ex`);
    const alert = this.alert;

    function promptInit() {
      document.querySelectorAll('.prompt-ex').forEach((prompt) => {
        prompt.querySelector('.prompt-control > input[type=button].standard').addEventListener('click', (event) => {
          event.target.parentElement.parentElement.parentElement.classList.remove('active');
        });

        prompt.addEventListener('click', (event) => {
          if (event.target.classList.contains('prompt-ex')) prompt.classList.remove('active');
        });
      });

      if (type === 'join-server') {
        const sidForm = prompt.querySelector('.prompt-content > form');
        const joinButton = prompt.querySelector('.prompt-control > input[type=button].save');

        const handleJoin = (event) => {
          event.preventDefault();

          const sid = new FormData(sidForm).get('sid').trim();

          if (sid.length === 10) {
            fetch('/chat/join', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sid })
            }).then(async (res) => {
              (await res.json()) ? alert('Successfully joined server!') : alert('Error: Check if the SID is valid.', true);
            });
          } else {
            alert('Error: Check if the SID is valid.', true);
          }

          prompt.classList.remove('active');
          setTimeout(() => sidForm.querySelector('input[type=text]').value = '', 600);
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
    message: ({ isSelf, un, text, time }) => {
      return `
      <div class="bubble-ex ${isSelf ? 'self' : 'server'}">
      <div class="user">${un}</div>
      <div class="bubble-in">
        <div class="msg">${text}</div>
        <div class="time">${time}</div>
      </div>
      </div>`;
    },
    server: ({ sid, name, users }) => { // NOTE: Parameter `users` should be parsed
      return `
      <li id="${sid}" class="server">
        <div class="server-info">
          <div class="server-id">${name}</div>
        </div>
      </li>`;
    }
  }
}