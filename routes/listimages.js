const express = require("express");

const router = express.Router();

// ATTENTION: This page does not use the authenticate middleware meaning its publicly available

router.post("/", function (req, res) {
  //const images = req.body.images;
  const images = JSON.parse(JSON.stringify(req.body));
  console.log(`ImAGES: ${JSON.stringify(images)}`);
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
