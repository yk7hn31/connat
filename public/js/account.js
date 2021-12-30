const form = document.querySelector('form');
const msg = document.querySelector('.msg');

const isSignIn = location.href.includes('signin');
const unRegex = /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){4,18}[a-zA-Z0-9]$/;
const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const msgList = {
  empty: ' Please fill out all of the input boxes.',
  incorrect: ' Incorrect username or password.',
  duplicate: ' Account with this username already exists.',
  success: ' You are now one of us.',
  retype: ' The retyped password has a typo.',
  un: ' Please follow the username <u onclick="alert(\'A username must be 6-20 in length and can include the dot, underscore and hyphen, and they must not be consecutive.\')">format</u>.',
  pw: ' Please follow the password <u onclick="alert(\'A password must be 8+ in length and include at least one upper/lowercase, one number and one special character.\')">format</u>.',
};

async function showMsg(msgContent) {
  if (msgContent === 'success') {
    msg.classList.remove('fail');
    msg.classList.add('success');
  } else {
    msg.classList.remove('success');
    msg.classList.add('fail');
  }

  msg.innerHTML = msgList[msgContent];

  msg.classList.remove('hidden');
  setTimeout(() => msg.classList.add('hidden'), 5000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const username = formData.get('username');
  const password = formData.get('password');
  const passwordConfirm = formData.get('passwordConfirm');

  if (username && password) {
    if (!isSignIn && (!passwordConfirm || !unRegex.test(username) || !password === passwordConfirm || !pwRegex.test(password))) {
      if (!passwordConfirm) showMsg('empty');
      else if (!unRegex.test(username)) showMsg('un');
      else if (password !== passwordConfirm) showMsg('retype');
      else if (!pwRegex.test(password)) showMsg('pw');
      return;
    }

    fetch(location.href, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }).then(async (res) => {
      const valid = await res.json();

      if (isSignIn) {
        valid ? location.href = '/' : showMsg('incorrect');
      } else {
        if (!valid) showMsg('duplicate');
        else {
          showMsg('success');
          setTimeout(() => (location.href = '/account/signin'), 2000);
        }
      }
    });
  } else {
    showMsg('empty');
  }
});