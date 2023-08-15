const msg = document.getElementById("msg");
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
    let res = await axios.post("http://localhost:4000/user/signup", userData);
    if (res.status === 201) {
      msg.innerHTML =
        msg.innerHTML + `<div style="color:green;">${res.data}</div>`;
      setTimeout(() => {
        msg.innerHTML = "";
        document.getElementById(
          "loginlink"
        ).innerHTML = `<a href="login.html"> Login </a>`;
      }, 800);
    }
  } catch (err) {
    console.log(err);
    msg.innerHTML =
      msg.innerHTML + `<div style="color:red;">${err.response.data}</div>`;
    setTimeout(() => (msg.innerHTML = ""), 800);
  }
}
