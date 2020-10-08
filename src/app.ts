import express, {NextFunction, Request, Response} from 'express'
import path from 'path'
import cookieParser from 'cookie-parser';
import HttpError from './HttpError';
import pino from 'pino'
import expressPino from 'express-pino-logger'

const logger = pino({ level: process.env.LOG_LEVEL || 'info' }); // todo move pino dependency to main modules (app.ts / server.ts) and wire dependencies there
const expressLogger = expressPino({ logger });

export const app = express();

const appName = "acme-apptemplatenode";
const basePath = "/" + appName;
const assetBasePath = process.env.ASSET_BASE_PATH || `/${appName}/assets`;

// application scoped variables
app.locals.base = basePath;

// view engine setup
app.set('views', path.join(__dirname,'views'))
app.set('view engine','hbs')

// setup common middleware invoked for all routes
app.use(expressLogger);
app.use(express.json({type: ['application/json', 'application/*+json']}));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(assetBasePath, express.static(path.join(__dirname, 'web')));

// app routes
app.get('/acme-apptemplatenode/', (req,res) => res.send('Express + TypeScript Server'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next (new HttpError(404,"Not found"))
});

// error handler
app.use((error: HttpError, request: Request, response: Response, next: NextFunction) => {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';

    logger.error(`HTTP Error ${status} ${message}`) // todo user error for 5xx Server errors and info for other Http status codes?

    response
        .status(status)
        .send({
            status,
            message,
        })
});

