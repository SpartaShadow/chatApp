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
