const express = require("express");

const router = express.Router();

// ATTENTION: This page does not use the authenticate middleware meaning its publicly available

router.get("/", function (req, res, next) {
  res.format({
    "application/hal+json": function () {
      res.send({
        extensions: [
          {
            id: "myapp.exportList",
            activationConditions: [
              {
                propertyId: "repository.id",
                operator: "or",
                values: ["e632f767-5cfa-538d-ab55-6756c36a74c9"],
              },
            ],
            captions: [
              { culture: "de", caption: "Liste exportieren" },
              { culture: "en", caption: "Export list" },
              { culture: "en-GB", caption: "Export list in Great Britain" },
            ],
            context: "DmsObjectListContextAction",
            uriTemplate:
              "/hackathon-demo/dosomething?files={dmsobjectlist.url}",
            iconUri: "/hackathon-demo/images/export-list-64x64.png",
          },
        ],
      });
    },

    default: function () {
      res.status(406).send("Not Acceptable");
    },
  });
});

module.exports = router;
