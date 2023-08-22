const closeBtn = document.getElementById("close");

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
    // parentNode.innerHTML=parent.innerHTML+`<p class="join">${res.data.name} joined</p>`;
  } catch (err) {
    console.log(err);
    alert(`${err.response.data.message}`);
  }
}

//SAVE MESSAGE
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
      "http://localhost:3000/verifiedUser/sendMsg",
      obj,
      { headers: { authorization: token } }
    );
    console.log(res.status);
    let merged = JSON.parse(localStorage.getItem("chat"));
    if (merged.length === 10) {
      merged.shift();
    }
    merged.push(res.data);
    localStorage.setItem("chat", JSON.stringify(merged));
    showMsg(res.data);
    parentNode.scrollTop = parentNode.scrollHeight;
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
      `http://localhost:3000/verifiedUser/getMsg?what=next&msgid=${msgid}`,
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

//LATEST MESSAGE
async function latestMsg() {
  const token = localStorage.getItem("token");
  try {
    let resp = await axios.get("http://localhost:3000/verifiedUser/latestMsg", {
      headers: { authorization: token },
    });
    console.log(resp);
    localStorage.setItem("chat", JSON.stringify(resp.data));
  } catch (err) {
    console.log(err);
  }
}

//DISPLAY MESSAGES
function showMsg(obj) {
  const leaf = `<p class="chatbox">${obj.name} : ${obj.message}</p>`;
  parentNode.innerHTML = parentNode.innerHTML + leaf;
}

//OLDER MESSAGES
async function oldMsg(event) {
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
      msgid = getmsgId[0].id;
      console.log(msgid);
    }
    let resp = await axios.get(
      `http://localhost:3000/verifiedUser/getMsg?what=old&msgid=${msgid}`,
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

//ADD GROUP
async function addGrp(event) {
  event.preventDefault();
  const grpName = event.target.grpName.value;
  const obj = {
    grpName,
  };
  event.target.grpName.value = " ";
  closeBtn.click();
  let mergedGrp = [];
  const token = localStorage.getItem("token");
  let resp = await axios.post("http://localhost:3000/user/login/addGrp", obj, {
    headers: { authorization: token },
  });
  console.log(resp);
  mergedGrp = JSON.parse(localStorage.getItem("grpname"));
  mergedGrp.push(resp.data.message);
  localStorage.setItem("grpname", JSON.stringify(mergedGrp));
  showGroup(resp.data.message);
}

async function getGrp() {
  const token = localStorage.getItem("token");
  let resp = await axios.get("http://localhost:3000/user/login/getGrp", {
    headers: { authorization: token },
  });
  console.log(resp);
  localStorage.setItem("grpname", JSON.stringify(resp.data.message));
}

function showGroup(obj) {
  const tile = `<button id=" ${obj.id} "  type="button" class="tilebtn">${obj.grpName}</button>`;
  tileNode.innerHTML = tileNode.innerHTML + tile;
}
