const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const tenant = require('./modules/tenant')(process.env.systemBaseUri, process.env.SIGNATURE_SECRET);
const requestId = require('./modules/requestid');

const appName = "acme-apptemplatenode";
const basePath = "/" + appName;
const assetBasePath = process.env.ASSET_BASE_PATH || `/${appName}/assets`;
const version = process.env.BUILD_VERSION || '1.0.0';

const rootRouter = require('./routes/root')(assetBasePath, basePath, version);
const featuresRouter = require('./routes/features')(assetBasePath, basePath);
const vacationrequestRouter = require('./routes/vacationrequest')(assetBasePath);
const idpDemoRouter = require('./routes/idpdemo')(assetBasePath);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.locals.base = basePath;

app.use(tenant);
app.use(requestId);
logger.token('tenantId', function getTenantId(req) {
    return req.tenantId
});
logger.token('requestId', function getRequestId(req) {
    return req.requestId
});
app.use(logger('[ctx@49610 rid=":requestId" tn=":tenantId"][http@49610 method=":method" url=":url" millis=":response-time" sbytes=":res[content-length]" status=":status"] '));
app.use(express.json({type: ['application/json', 'application/*+json']}));

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(assetBasePath, express.static(path.join(__dirname, 'web')));

app.use(basePath + '/', rootRouter);
app.use(basePath + '/features', featuresRouter);
app.use(basePath + '/vacationrequest/', vacationrequestRouter);
app.use(basePath + '/idpdemo', idpDemoRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.error(err.message);

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
