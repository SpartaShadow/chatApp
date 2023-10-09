let username = localStorage.getItem("username");

//SOCKET

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log(socket.id);
  displayJoin(username);
});

socket.on("receive-message", (usermsg) => {
  displayMessage(usermsg);
});

//DSIPLAY MESSAGE
function displayMessage(usermsg) {
  const leaf = `<p class="chatbox">${usermsg.name} : ${usermsg.message}</p>`;
  parentNode.innerHTML = parentNode.innerHTML + leaf;
  parentNode.scrollTop = parentNode.scrollHeight;
}

//DISPLAY JOINED
function displayJoin(name) {
  const leaf = `<p class="join">${name}</p>`;
  parentNode.innerHTML = parentNode.innerHTML + leaf;
  parentNode.scrollTop = parentNode.scrollHeight;
}

//SAVE MESSAGE
async function saveMsg(event) {
  event.preventDefault();
  const gid = localStorage.getItem("groupid");
  const message = event.target.msg.value;
  const usermsg = {
    message,
    name: username,
  };
  displayMessage(usermsg);
  socket.emit("send-message", gid, usermsg);
  event.target.msg.value = " ";
  let obj = {
    message,
    gid: gid,
  };
  try {
    const token = localStorage.getItem("token");
    let res = await axios.post(
      "http://localhost:3000/verifiedUser/sendMsg",
      obj,
      { headers: { authorization: token } }
    );
    console.log(res.status);
    console.log(res);
    let merged = JSON.parse(localStorage.getItem("chat"));
    if (merged.length === 10) {
      merged.shift();
    }
    merged.push(res.data);
    localStorage.setItem("chat", JSON.stringify(merged));
    //showMsg(res.data)
    //    parentNode.scrollTop = parentNode.scrollHeight
  } catch (err) {
    console.log(err);
  }
}

//GET NEXT 10 MESSAGES
async function nextMsg(event) {
  event.preventDefault();
  if (!localStorage.getItem("token")) {
    return (window.location.href = "../script/login.js");
  }
  const token = localStorage.getItem("token");
  const gid = localStorage.getItem("groupid");
  try {
    let msgid = 0;
    let getmsgId = [];
    if (localStorage.getItem("chat")) {
      getmsgId = JSON.parse(localStorage.getItem("chat"));
      msgid = getmsgId[getmsgId.length - 1].id;
    }
    let resp = await axios.get(
      `http://localhost:3000/verifiedUser/getMsg?gid=${gid}&what=next&msgid=${msgid}`,
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

//LATEST 10 MESSAGE
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

//10 OLDER MESSAGES
async function oldMsg(event) {
  event.preventDefault();
  if (!localStorage.getItem("token")) {
    return (window.location.href = "../script/login.js");
  }
  const token = localStorage.getItem("token");
  const gid = localStorage.getItem("groupid");
  try {
    let msgid = 0;
    let getmsgId = [];
    if (localStorage.getItem("chat")) {
      getmsgId = JSON.parse(localStorage.getItem("chat"));
      msgid = getmsgId[0].id;
      console.log(msgid);
    }
    let resp = await axios.get(
      `http://localhost:3000/verifiedUser/getMsg?gid=${gid}&what=old&msgid=${msgid}`,
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

//GET MEMBERS OF A GROUP
async function getMembers(grpid) {
  try {
    const token = localStorage.getItem("token");
    let resp = await axios.get(
      `http://localhost:3000/user/login/getMembers/?gid=${grpid}`,
      { headers: { authorization: token } }
    );
    console.log(resp);
    localStorage.setItem("members", JSON.stringify(resp.data.users));
    localStorage.setItem("chat", JSON.stringify(resp.data.chats));
    localStorage.setItem("isAdmin", JSON.stringify(resp.data.admin.isAdmin));
    localStorage.setItem("groupid", grpid);
    memberNode.innerHTML = "";
    parentNode.innerHTML = "";
    for (let i = 0; i < resp.data.chats.length; i++) {
      showMsg(resp.data.chats[i]);
    }
    const leaveId = localStorage.getItem("groupid");
    localStorage.setItem("groupid", grpid);
    socket.emit("leave-room", leaveId);
    console.log(leaveId);
    console.log(grpid);
    socket.emit("join-room", grpid, username, (welcome) => {
      displayJoin(welcome);
    });
    if (resp.data.admin.isAdmin === true) {
      for (let i = 0; i < resp.data.users.length; i++) {
        showMember(resp.data.users[i], "membtnmini", grpid);
      }
    } else {
      for (let i = 0; i < resp.data.users.length; i++) {
        showMember(resp.data.users[i], "membtnmini2", grpid);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

//SHOW ONLY USERS
async function showUserOnly() {
  try {
    let resp = await axios.get("http://localhost:3000/user/login/showUserOnly");
    console.log(resp);
    localStorage.setItem("members", JSON.stringify(resp.data.users));
    localStorage.setItem("chat", JSON.stringify(resp.data.chats));
    localStorage.setItem("isAdmin", JSON.stringify(undefined));
    const leaveId = localStorage.getItem("groupid");
    localStorage.setItem("groupid", 0);
    const joinId = localStorage.getItem("groupid");
    console.log(leaveId);
    memberNode.innerHTML = "";
    parentNode.innerHTML = "";
    for (let i = 0; i < resp.data.chats.length; i++) {
      showMsg(resp.data.chats[i]);
    }
    socket.emit("leave-room", leaveId);
    console.log(joinId);
    socket.emit("join-room", joinId, username, (welcome) => {
      displayJoin(welcome);
    });
    resp.data.users.forEach((ele) => {
      const tile = `<div class="membtn" ><p style="margin-left: 1.8em;margin-top:1.5em;">${ele.name}</p>
    </div>`;
      memberNode.innerHTML = memberNode.innerHTML + tile;
    });
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
  closeGrp.click();
  let mergedGrp = [];
  const token = localStorage.getItem("token");
  let resp = await axios.post("http://localhost:3000/user/login/addGrp", obj, {
    headers: { authorization: token },
  });
  console.log(resp);
  mergedGrp = JSON.parse(localStorage.getItem("grpname"));
  resp.data.message.isAdmin = true;
  mergedGrp.push(resp.data.message);
  localStorage.setItem("grpname", JSON.stringify(mergedGrp));
  showGroup1(resp.data.message);
}

//GET ALL GROUPS
async function getGrp() {
  const token = localStorage.getItem("token");
  let resp = await axios.get("http://localhost:3000/user/login/getGrp", {
    headers: { authorization: token },
  });
  console.log(resp);
  localStorage.setItem("grpname", JSON.stringify(resp.data.message));
}

//SHOW GROUP
function showGroup(obj) {
  obj.forEach((ele) => {
    let tile = `<button type="button" onclick= getMembers('${ele.id}') class="tilebtn">${ele.grpName}</button>`;
    if (ele.isAdmin === true) {
      tile = `<div id="${ele.id}"><button type="button" onclick= "getMembers('${ele.id}')" ondblclick="deleteGrp('${ele.id}')" class="tilebtn">${ele.grpName}</button></div>`;
    }
    tileNode.innerHTML = tileNode.innerHTML + tile;
  });
}

//SHOW NEWLY ADDED GROUP
function showGroup1(ele) {
  let tile = `<button type="button" onclick= getMembers('${ele.id}') class="tilebtn">${ele.grpName}</button>`;
  if (ele.isAdmin === true) {
    tile = `<div id="${ele.id}"><button type="button" onclick= "getMembers('${ele.id}')" ondblclick="deleteGrp('${ele.id}')" class="tilebtn">${ele.grpName}</button></div>`;
  }
  tileNode.innerHTML = tileNode.innerHTML + tile;
}

//SHOW MEMBERS
function showMember(obj, css, gid) {
  const tile = `<div id=${obj.userId} class="membtn" ><p style="margin-left: 1.8em;margin-top:1.5em;">${obj.name}</p>
    <div style="margin-top:-3.1em;"><button type="button" onclick="makeAdmin('${obj.userId}','${gid}')" class="${css}">Make Admin</button>
      <button type="button" onclick="removeAdmin('${obj.userId}','${gid}')" class="${css}">RemoAdmin</button>
      <button type="button" onclick="removeFromGroup('${obj.userId}','${gid}')" class="${css}">Delete Mem</button></div></div>`;
  memberNode.innerHTML = memberNode.innerHTML + tile;
}

//SEARCH FOR A PARTICULAR USER
async function openForm1(event) {
  document.getElementById("myForm1").style.display = "block";
  const filterer = searchNode.value.toLowerCase();
  let resp = await axios.get(
    `http://localhost:3000/user/login/getUsers/?search=${filterer}`
  );
  console.log(resp);
  console.log(filterer);
  userNode.innerHTML = "";
  resp.data.forEach((ele) => {
    userNode.innerHTML =
      userNode.innerHTML +
      `<p><a style="cursor: pointer;" onclick="return addUser('${ele.id}','${ele.name}')"><span>&#10004
    </span></a> ${ele.name}</p>`;
  });
}

//POP-UP FORM
function closeForm1() {
  document.getElementById("myForm1").style.display = "none";
}

//ADD USER TO GROUP
async function addUser(id, name) {
  const gid = localStorage.getItem("groupid");
  let resp = await axios.get(
    `http://localhost:3000/user/addToGroup/?id=${id}&gid=${gid}`
  );
  console.log(resp.data.message);
  closeBtn.click();
  localStorage.removeItem(members);
  const user = {
    userId: id,
    name: name,
  };
  showMember(user, "membtnmini", gid);
}

//MAKE ADMIN
async function makeAdmin(id, gid) {
  let resp = await axios.get(
    `http://localhost:3000/user/makeAdmin/?id=${id}&gid=${gid}`
  );
  console.log(resp.data.message);
}

//REMOVE ADMIN
async function removeAdmin(id, gid) {
  let resp = await axios.get(
    `http://localhost:3000/user/removeAdmin/?id=${id}&gid=${gid}`
  );
  console.log(resp.data.message);
}

//REMOVE USER FROM A GROUP
async function removeFromGroup(id, gid) {
  let resp = await axios.get(
    `http://localhost:3000/user/removeFromGroup/?id=${id}&gid=${gid}`
  );
  console.log(resp.data.message);
  getMembers(gid);
  const child = document.getElementById(id);
  memberNode.removeChild(child);
}

//DELETE A GROUP
async function deleteGrp(gid) {
  let resp = await axios.get(
    `http://localhost:3000/user/deleteGrp/?gid=${gid}`
  );
  console.log(resp.data.message);
  localStorage.removeItem("grpname");
  const child = document.getElementById(gid);
  tileNode.removeChild(child);
}

//UPLOAD FILE
async function uploadFile(event) {
  try {
    event.preventDefault();
    const uploadedfile = file.files[0];
    console.log(uploadedfile);
    if (!uploadedfile) {
      alert("Please Upload a file ");
    } else {
      const formData = new FormData();
      formData.append("file", uploadedfile);
      console.log(formData);
      const groupId = JSON.parse(localStorage.getItem("groupid"));
      const token = localStorage.getItem("token");
      const result = await axios.post(
        `http://localhost:3000/verifiedUser/sendfile/${groupId}`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(result);
      showmessage(result.data.message.name, result.data.message.message);
      file.value = null;
    }
  } catch (err) {
    console.log(err);
    alert(err.response.data.message);
  }
}
