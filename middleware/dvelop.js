const appRouter = require("@dvelop-sdk/app-router");

function setContext(req, res, next) {
    req.systemBaseUri = req.get(appRouter.DVELOP_SYSTEM_BASE_URI_HEADER) || process.env.systemBaseUri;
    req.tenantId = req.get(appRouter.DVELOP_TENANT_ID_HEADER) || 0;
    req.requestId = req.get(appRouter.DVELOP_REQUEST_ID_HEADER) || appRouter.generateRequestId();
    const requestSignature = req.get(appRouter.DVELOP_REQUEST_SIGNATURE_HEADER);

    // ATTENTION: The RequestSignature should always be validated. Invalid RequestSiganuters might be a security risk.
    const validRequest = appRouter.validateRequestSignature(process.env.SIGNATURE_SECRET, req.systemBaseUri, req.tenantId, requestSignature);

    if (validRequest) {
        next();
    } else {
        res.status(401).send("Forbidden");
    }
}

module.exports = { setContext }