const LOGGER = require('../../logger')('./server/cron/cronJobs.js');
const scheduledStreamInfoUpdater = require('./scheduledStreamInfoUpdater');

const cronJobs = [scheduledStreamInfoUpdater];

module.exports.startAll = () => {
    cronJobs.forEach(async cronJob => {
        await cronJob.job.start();
        if (cronJob.job.running) {
            const jobName = cronJob.jobName || Object.keys(cronJob)[0];
            LOGGER.info('Started {} cron job with cron time: {}', jobName, cronJob.job.cronTime);
        }
    });
}