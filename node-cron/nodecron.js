const nodeCron = require("node-cron");

const job = nodeCron.schedule(
  "59 59 02 * * *",
  async function copydelete() {
    const result = await axios.get(
      "http://localhost:3000/verifiedUser/copydelete"
    );
    console.log(result);
  },
  { scheduled: true, timezone: "Asia/Kolkata" }
);

module.exports = job;
