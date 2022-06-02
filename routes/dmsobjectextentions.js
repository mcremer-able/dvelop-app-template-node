const express = require("express");

const router = express.Router();

// ATTENTION: This page does not use the authenticate middleware meaning its publicly available

router.get("/", function (req, res, next) {
  res.format({
    "application/hal+json": function () {
      res.send({
        extensions: [
          {
            id: "hackathon.exportList",
            activationConditions: [
              {
                propertyId: "repository.id",
                operator: "or",
                values: ["0dbdff0f-ae8d-495e-a158-29a1d2a3bc82"],
              },
            ],
            captions: [
              { culture: "de", caption: "HACKATHON LIST" },
              { culture: "en", caption: "Export list" },
              { culture: "en-GB", caption: "Export list in Great Britain" },
            ],
            context: "DmsObjectListContextAction",
            uriTemplate:
              "/hackathon-demo/assets/view/?files={dmsobjectlist.url}",
            iconUri: "/hackathon-demo/assets/view/favicon.png",
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
