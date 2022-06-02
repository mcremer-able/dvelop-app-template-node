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
  const documentIds = req.body.documents.join(",");
  let data;
  try {
    console.log(`Document IDs: ${documentIds}`);
    data = await runPythonScript(documentIds);
    data = data.split(",").map((element) => element.trim());
  } catch (error) {
    return res.status(500).json({ error, args: documentIds });
  }

  res.format({
    "application/hal+json": function () {
      res.send(data);
    },

    default: function () {
      res.status(406).send("Not Acceptable");
    },
  });
});

module.exports = router;
