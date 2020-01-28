const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const tenant = require('./modules/tenant')(process.env.systemBaseUri, process.env.SIGNATURE_SECRET);

const appName = "acme-apptemplatenode";
const basePath = "/" + appName;
const assetBasePath = process.env.ASSET_BASE_PATH || `/${appName}/assets`;
const version = process.env.BUILD_VERSION || '1.0.0';

const rootRouter = require('./routes/root')(assetBasePath, basePath, version);
const featuresRouter = require('./routes/features')(assetBasePath, basePath);
const vacationrequestRouter = require('./routes/vacationrequest')(assetBasePath);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(assetBasePath, express.static(path.join(__dirname, 'web')));
app.use(tenant);

app.use(basePath + '/', rootRouter);
app.use(basePath + '/features', featuresRouter);
app.use(basePath + '/vacationrequest/', vacationrequestRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.error (err.message);

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
