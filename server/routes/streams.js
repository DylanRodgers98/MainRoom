const express = require('express');
const router = express.Router();
const config = require('../../mainroom.config');
const axios = require('axios');
const {User} = require('../database/schemas');
const _ = require('lodash');
const sanitise = require('mongo-sanitize');
const LOGGER = require('../../logger')('./server/routes/streams.js');

router.get('/', async (req, res, next) => {
    const result = await axios.get(`http://${config.rtmpServer.host}:${config.rtmpServer.http.port}/api/streams`);
    const streamKeys = result.data.live ? Object.getOwnPropertyNames(result.data.live) : [];
    if (streamKeys.length) {
        const query = {
            'streamInfo.streamKey': {$in: streamKeys}
        };
        if (req.query.searchQuery) {
            const sanitisedQuery = sanitise(req.query.searchQuery);
            const escapedQuery = _.escapeRegExp(sanitisedQuery)
            const searchQuery = new RegExp(`^${escapedQuery}$`, 'i');
            query.$or = [{'streamInfo.title': searchQuery}, {'streamInfo.tags': searchQuery}, {username: searchQuery}];
        }
        if (req.query.genre) {
            query['streamInfo.genre'] = sanitise(req.query.genre);
        }
        if (req.query.category) {
            query['streamInfo.category'] = sanitise(req.query.category);
        }
        if (req.query.usernames) {
            query.username = {$in: req.query.usernames}
        }

        const options = {
            select: 'username displayName streamInfo.streamKey',
            page: req.query.page,
            limit: req.query.limit
        };

        User.paginate(query, options, (err, result) => {
            if (err) {
                LOGGER.error('An error occurred when finding livestream info: {}', err);
                next(err);
            } else if (result) {
                res.json({
                    streams: result.docs.map(user => {
                        return {
                            username: user.username,
                            displayName: user.displayName,
                            streamKey: user.streamInfo.streamKey
                        };
                    }),
                    nextPage: result.nextPage
                });
            }
        });
    } else {
        res.json({});
    }
});

module.exports = router;