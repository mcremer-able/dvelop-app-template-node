const express = require("express");
const { spawn } = require("child_process");
const router = express.Router();

const runPythonScript = (documentIds) => {
  return new Promise((resolve, reject) => {
    const python = spawn("python", ["./id_to_url.py", documentIds]);
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
  let documentIds;
  let data;
  try {
    documentIds = req.body.documents.join(",");

    console.log(`Document IDs: ${documentIds}`);
    data = await runPythonScript(documentIds);

    console.log(`Python data: ${data}`);

    //testData = "www.example.com;K0001;pdf#www.example2.com;K0002;pdf";
    data = data.split("#").map((element) => {
      let record = element.split(";");
      return {
        docID: record[0].trim(),
        url: record[1].trim(),
        mime: record[2].trim(),
        error: typeof record[3] === "undefined" ? false : record[3],
      };
    });
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
