const express = require('express');
const uuid = require('uuid');
const dvelop = require('../middleware/dvelop');



let vacationRequests = [
    {
        id: '06e8c6be-0ad6-46e5-952e-1bc3d3cbe856',
        user: "Leonard Hofstadter",
        from: new Date('2020-04-01'),
        to: new Date('2020-04-01'),
        state: 'ACCEPTED',
        type: 'Compensatory off time',
        comment: 'I have to take Sheldon to the dentist.'
    },
    {
        id: '8d404a9c-81ff-4cde-bb26-9801ee219b2d',
        user: "Howard Wolowitz",
        from: new Date('2020-12-24'),
        to: new Date('2020-12-31'),
        state: 'DENIED',
        type: 'Annual leave'
    }
];

module.exports = function (assetBasePath) {
    const router = express.Router();

    router.use(dvelop.authenticate); // This page requires a logged in user.

    router.get('/', function (req, res, next) {
        res.format({
            'text/html': function () {
                res.render('vacationrequests', {title: 'Vacation requests', stylesheet: `${assetBasePath}/vacationrequests.css`, script: `${assetBasePath}/vacationrequests.js`});
            },
            'application/hal+json': function () {
                res.send({
                    vacationRequests: vacationRequests
                });
            },
            'default': function () {
                res.status(406).send('Not Acceptable')
            }
        });
    });

    router.get('/new', function (req, res, next) {
        res.format({
            'text/html': function () {
                res.render('new-vacationrequest', {title: 'New Request', stylesheet: `${assetBasePath}/new-vacationrequest.css`, script: `${assetBasePath}/new-vacationrequest.js`});
            },
            'default': function () {
                res.status(406).send('Not Acceptable')
            }
        });
    });

    router.post('/', (req, res) => {

        let error = validateVacationRequest(req.body);

        if(error) {
            res.status(400).send(error);
        } else if (req.body.id !== undefined) {
            res.status(400).send({error: 'Cannot specify id'});
        } else {
            let newRequest = JSON.parse(JSON.stringify(req.body));
            newRequest.id = uuid();
            vacationRequests.push(newRequest);
            res.status(201).send({id: newRequest.id});
        }
    });

    router.patch('/:id', (req, res) => {

        let index;
        let vacationRequest = vacationRequests.find((vr, i) => {
            if (vr.id === req.params.id) {
                index = i;
                return true;
            }
            return false;
        });

        if (!vacationRequest) {
            res.status(404).send('Not found');
        }

        console.log(req.body)

        try {
            if (req.body.hasOwnProperty('user')) {
                console.log('USER')
                validateUser(req.body.user);
                vacationRequests[index].user = req.body.user;
            }
            if (req.body.hasOwnProperty('from')) {
                validateDate(new Date(req.body.from));
                vacationRequests[index].from = req.body.from;
            }
            if (req.body.hasOwnProperty('to')) {
                validateDate(new Date(req.body.to));
                vacationRequests[index].to = req.body.to;
            }
            if (req.body.hasOwnProperty('type')) {
                validateType(req.body.type);
                vacationRequests[index].type = req.body.type;
            }
            if (req.body.hasOwnProperty('state')) {
                validateUser(req.body.state);
                vacationRequests[index].state = req.body.state;
            }
            if (req.body.hasOwnProperty('comment')) {
                vacationRequests[index].comment = req.body.comment;
            }
        } catch (e) {
            res.status(400).send(e);
        }

        res.sendStatus(200);
    });

    return router;
};

function validateVacationRequest(request) {
    try {
        validateUser(request.user);
        validateDate(new Date(request.from));
        validateDate(new Date(request.to));
        validateType(request.type);
        validateState(request.state);
    } catch (e) {
        console.log(e)
        return e;
    }
    return null;
}

function validateUser(user) {
    if (!user) {
        throw { error: 'User is mandatory'}
    }
}

function validateDate(date) {
    if (date == 'Invalid Date' || date.getTime() === new Date(null).getTime()) {
        throw { error: 'Bad Date'}
    }
}

function validateType(type) {
    if (type !== 'Compensatory off time' && type !== 'Annual leave' && type !== 'Special leave') {
        throw { error: 'Bad type'}
    }
}

function validateState(state) {
    if (state !== 'PENDING' && state !== 'ACCEPTED' && state !== 'DENIED') {
        throw { error: 'Bad State'}
    }
}