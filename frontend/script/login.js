//SIGNUP
async function signUp(event) {
  event.preventDefault();
  const name = event.target.name.value;
  const email = event.target.email.value;
  const number = event.target.number.value;
  const password = event.target.password.value;
  const userData = {
    name,
    email,
    number,
    password,
  };
  try {
    let res = await axios.post("http://localhost:3000/user/signup", userData);
    if (res.status === 201) {
      alert(`${res.data.message}`);
    }
  } catch (err) {
    alert(`${err.response.data.message}`);
  }
}

//LOGIN
async function logUp(event) {
  event.preventDefault();
  const email = event.target.chemail.value;
  const password = event.target.chpassword.value;
  const userData = {
    email,
    password,
  };
  try {
    let res = await axios.post("http://localhost:3000/user/login", userData);
    localStorage.setItem("token", res.data.token);
    alert(`${res.data.message}`);
    window.location.href = "../views/chatApp.html";
  } catch (err) {
    console.log(err);
    alert(`${err.response.data.message}`);
  }
}

async function saveMsg(event) {
  event.preventDefault();
  const message = event.target.msg.value;
  event.target.msg.value = " ";
  const obj = {
    message,
  };
  try {
    const token = localStorage.getItem("token");
    let res = await axios.post(
      "http://localhost:3000/user/login/sendMsg",
      obj,
      { headers: { authorization: token } }
    );
    console.log(res);
  } catch (err) {
    console.log(err);
  }
}

//REFRESH
async function nextMsg(event) {
  event.preventDefault();
  if (!localStorage.getItem("token")) {
    return (window.location.href = "../views/login.html");
  }
  const token = localStorage.getItem("token");
  try {
    let msgid = 0;
    let getmsgId = [];
    if (localStorage.getItem("chat")) {
      getmsgId = JSON.parse(localStorage.getItem("chat"));
      msgid = getmsgId[getmsgId.length - 1].id;
    }
    let resp = await axios.get(
      `http://localhost:3000/user/login/getMsg?what=next&msgid=${msgid}`,
      { headers: { authorization: token } }
    );
    console.log(resp);
    parentNode.innerHTML = " ";
    let mergedChat = [...getmsgId, ...resp.data];
    while (mergedChat.length > 10) {
      mergedChat.shift();
    }
    localStorage.setItem("chat", JSON.stringify(mergedChat));
    let parsedChat = JSON.parse(localStorage.getItem("chat"));
    console.log(parsedChat);
    for (let i = 0; i < parsedChat.length; i++) {
      await showMsg(parsedChat[i]);
      parentNode.scrollTop = parentNode.scrollHeight;
    }
  } catch (err) {
    console.log(err);
  }
}

async function latestMsg() {
  const token = localStorage.getItem("token");
  try {
    let resp = await axios.get("http://localhost:3000/user/login/latestMsg", {
      headers: { authorization: token },
    });
    console.log(resp);
    parentNode.innerHTML = " ";
    localStorage.setItem("chat", JSON.stringify(resp.data));
    let parsedChat = JSON.parse(localStorage.getItem("chat"));
    for (let i = 0; i < parsedChat.length; i++) {
      await showMsg(parsedChat[i]);
      parentNode.scrollTop = parentNode.scrollHeight;
    }
  } catch (err) {
    console.log(err);
  }
}

//DISPLAY MESSAGES
function showMsg(obj) {
  const leaf = `<p class="chatbox">${obj.user.name} : ${obj.message}</p>`;
  parentNode.innerHTML = parentNode.innerHTML + leaf;
}

//OLDER MESSAGES
async function oldMsg(event) {
  event.preventDefault();
  if (!localStorage.getItem("token")) {
    return (window.location.href = "/views/login.html");
  }
  const token = localStorage.getItem("token");
  try {
    let msgid = 0;
    let getmsgId = [];
    if (localStorage.getItem("chat")) {
      getmsgId = JSON.parse(localStorage.getItem("chat"));
      msgid = getmsgId[0].id;
      console.log(msgid);
    }
    let resp = await axios.get(
      `http://localhost:3000/user/login/getMsg?what=old&msgid=${msgid}`,
      { headers: { authorization: token } }
    );
    console.log(resp);
    parentNode.innerHTML = " ";
    let mergedChat = [...getmsgId, ...resp.data];
    while (mergedChat.length > 10) {
      mergedChat.shift();
    }
    localStorage.setItem("chat", JSON.stringify(mergedChat));
    let parsedChat = JSON.parse(localStorage.getItem("chat"));
    console.log(parsedChat);
    for (let i = 0; i < parsedChat.length; i++) {
      await showMsg(parsedChat[i]);
      parentNode.scrollTop = parentNode.scrollHeight;
    }
  } catch (err) {
    console.log(err);
  }
}
