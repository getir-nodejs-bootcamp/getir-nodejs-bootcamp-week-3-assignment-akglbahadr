//depencencies
const fs = require("fs");

//logging methods, reqs
const log = (req, res, next) => {
  const getirBiDate = new Date().toTimeString();
  fs.appendFile(
    "getirBiLog.txt",
    `--${req.url} requested,${
      req.method
    } method, at ${getirBiDate} returned the page successfully!\nrequest body:${JSON.stringify(
      req.body
    )} auth header: ${req.headers["authorization"]}\n`,
    function (err) {
      if (err) throw err;
      console.log("Appending is successful!");
    }
  );
  next();
};

module.exports = {
  log,
};
