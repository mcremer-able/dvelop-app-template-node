const express = require("express");
const { spawn } = require("child_process");
const router = express.Router();

const runPythonScript = (documentIds) => {
  return new Promise((resolve, reject) => {
    const python = spawn("python", ["./test.py", documentIds]);
    python.stdout.on("data", (data) => {
      resolve(data.toString());
    });

    python.stderr.on("data", (data) => {
      reject(data.toString());
    });
  });
};

// ATTENTION: This page does not use the authenticate middleware meaning its publicly available

router.post("/", async function (req, res) {
  //const images = req.body.images;
  const reqData = JSON.parse(JSON.stringify(req.body));
  const documentIds = JSON.stringify(reqData.images);
  console.log(`Document IDs: ${documentIds}`);

  const data = await runPythonScript(documentIds);
  console.log(`Data: ${JSON.stringify(data)}`);

  res.format({
    "application/hal+json": function () {
      res.send("POST request to get list of images");
    },

    default: function () {
      res.status(406).send("Not Acceptable");
    },
  });
});

module.exports = router;
