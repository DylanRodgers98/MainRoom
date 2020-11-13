const {CronJob} = require('cron');
const config = require('../../mainroom.config');
const {ScheduledStream, User} = require('../model/schemas');
const moment = require('moment');
const mainroomEventEmitter = require('../mainroomEventEmitter');
const LOGGER = require('../../logger')('./server/cron/upcomingScheduledStreamEmailer.js');

const jobName = 'Upcoming Scheduled Stream Emailer';

const job = new CronJob(config.cron.upcomingScheduledStreamEmailer, () => {
    LOGGER.debug(`${jobName} triggered`);

    if (!config.email.enabled) {
        LOGGER.info('Email is not enabled, so will not send emails about upcoming scheduled streams');
    } else {
        User.find({emailSettings: {subscriptionScheduledStreamStartingIn: {$gte: 0}}},
            'username displayName email emailSettings.subscriptionScheduledStreamStartingIn subscriptions',
            (err, users) => {
                if (err) {
                    LOGGER.error('An error occurred when looking for users to email about streams starting soon: {}', err);
                    throw err;
                } else {
                    users.forEach(user => {
                        const startTime = moment().add(user.emailSettings.subscriptionScheduledStreamStartingIn, 'minutes').valueOf();
                        ScheduledStream.find({user: {$in: user.subscriptions}, startTime})
                            .select('user title startTime endTime')
                            .populate({
                                path: 'user',
                                select: 'username displayName profilePicURL'
                            })
                            .exec((err, streams) => {
                                if (err) {
                                    LOGGER.error('An error occurred when looking for streams starting soon: {}', err);
                                    throw err;
                                } else {
                                    const userData = {
                                        email: user.email,
                                        displayName: user.displayName,
                                        username: user.username
                                    };
                                    mainroomEventEmitter.emit('onScheduledStreamStartingSoon', userData, streams);
                                }
                            });
                    });
                }
            });
    }

    LOGGER.debug(`${jobName} finished`);
});

module.exports = {jobName, job};