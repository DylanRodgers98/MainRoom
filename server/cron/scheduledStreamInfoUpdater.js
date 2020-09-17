const {CronJob} = require('cron');
const config = require('../../mainroom.config');
const {ScheduledStream, User} = require('../database/schemas');
const LOGGER = require('../logger')('server/cron/scheduledStreamInfoUpdater.js');

let lastTimeTriggered = Date.now();

const job = new CronJob(config.cron.scheduledStreamInfoUpdater, async () => {
    const thisTimeTriggered = job.lastDate().valueOf();

    const streams = await ScheduledStream.find({
        $and: [
            {startTime: {$gt: lastTimeTriggered}},
            {startTime: {$lte: thisTimeTriggered}}
        ]
    });

    if (streams.length) {
        LOGGER.info(`Updating ${streams.length} user${streams.length === 1 ? `'s` : `s'`} stream info from scheduled streams`);
        let updated = 0;
        streams.forEach(stream => {
            User.findByIdAndUpdate(stream.user._id, {
                'streamInfo.title': stream.title,
                'streamInfo.genre': stream.genre,
                'streamInfo.category': stream.category,
                'streamInfo.tags': stream.tags
            }, err => {
                if (!err) {
                    updated++;
                }
            });
        });
        LOGGER.info(`Successfully updated ${updated}/${streams.length} user${streams.length === 1 ? `'s` : `s'`} stream info from scheduled streams`);
    }
    lastTimeTriggered = thisTimeTriggered;
});

module.exports = {
    jobName: 'Scheduled Stream Info Updater',
    job: job
};