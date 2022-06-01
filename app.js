const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dvelop = require("@dvelop-sdk/express-utils");
require("dotenv").config();

const appName = "hackathon-demo";
const basePath = "/" + appName;
const assetBasePath = process.env.ASSET_BASE_PATH || `/${appName}/assets`;
const version = process.env.BUILD_VERSION || "1.0.1";

const rootRouter = require("./routes/root")(assetBasePath, basePath, version);
const cloudCenterEventRouter = require("./routes/cloudcenterevents")();
const featuresRouter = require("./routes/features")(assetBasePath, basePath);
const vacationrequestRouter = require("./routes/vacationrequest")(
  assetBasePath
);
const idpDemoRouter = require("./routes/idpdemo")(assetBasePath);
const dmsobjectextensions = require("./routes/dmsobjectextentions");

const app = express();

// express parsing
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.locals.base = basePath;

app.use(
  basePath + "/dvelop-cloud-lifecycle-event",
  dvelop.validateCloudCenterEventSignatureMiddlewareFactory("APP_SECRET"),
  cloudCenterEventRouter
);

app.use(dvelop.contextMiddleware);
// app.use(dvelop.validateSignatureMiddlewareFactory('APP_SECRET')); // ATTENTION: This middleware should be commented in for every request once the app runs within d.velop context

logger.token("tenantId", function getTenantId(req) {
  return req.dvelopContext.tenantId;
});
logger.token("requestId", function getRequestId(req) {
  return req.dvelopContext.requestId;
});
app.use(
  logger(
    '[ctx@49610 rid=":requestId" tn=":tenantId"][http@49610 method=":method" url=":url" millis=":response-time" sbytes=":res[content-length]" status=":status"] '
  )
);
app.use(express.json({ type: ["application/json", "application/*+json"] }));

app.use(assetBasePath, express.static(path.join(__dirname, "web")));

app.use(basePath + "/", rootRouter);
app.use(basePath + "/features", featuresRouter);
app.use(basePath + "/vacationrequest/", vacationrequestRouter);
app.use(basePath + "/idpdemo", idpDemoRouter);
app.use(basePath + "/dmsobjectextensions", dmsobjectextensions);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  console.error(err.message);

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
