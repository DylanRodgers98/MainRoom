const logger = require('./logger');

module.exports = {
    siteTitle: 'Mainroom',
    headTitle: `Mainroom - Livestreaming for DJs, bands and artists`,
    server: {
        host: '127.0.0.1',
        http: {
            port: 8080
        }
    },
    rtmpServer: {
        host: '127.0.0.1',
        logType: logger.resolveLogLevel(),
        rtmp: {
            port: 1935,
            chunk_size: 60000,
            gop_cache: true,
            ping: 60,
            ping_timeout: 30
        },
        http: {
            port: 8888,
            mediaroot: './server/media',
            allow_origin: '*'
        },
        trans: {
            ffmpeg: process.env.FFMPEG_PATH,
            tasks: [
                {
                    app: 'live',
                    hls: true,
                    hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                    dash: true,
                    dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
                }
            ]
        }
    },
    validation: {
        password: {
            minLength: 8,
            maxLength: 64,
            minLowercase: 1,
            minUppercase: 1,
            minNumeric: 1,
            minSpecialChars: 1,
            allowedSpecialChars: '-[]/{}()*+?.\\^$|~`!#%^&=;,\'":<>'
        }
    },
    cron: {
        scheduledStreamInfoUpdater: '* * * * *',
        upcomingScheduledStreamEmailer: '* * * * *'
    },
    storage: {
        thumbnails: {
            ttl: 30 * 1000 // 30 seconds
        },
        scheduledStream: {
            ttl: 7 * 24 * 60 * 60 * 1000 // 7 days
        },
        passwordResetToken: {
            ttl: 10 * 60 * 1000 // 10 minutes
        },
        s3: {
            staticContent: {
                bucketName: 'mainroom-static-content',
                keyPrefixes: {
                    profilePics: 'profile-pics',
                    streamThumbnails: 'stream-thumbnails'
                }
            }
        }
    },
    pagination: {
        limit: 12,
        subscriptionsAndFeaturedLimit: 6
    },
    defaultProfilePicURL: 'https://mainroom-static-content.s3.amazonaws.com/default_profile_pic.png',
    defaultThumbnailURL: 'https://mainroom-static-content.s3.amazonaws.com/default_stream_thumbnail.png',
    email: {
        enabled: false,
        ses: {
            templateNames: {
                newSubscriber: 'newSubscriber',
                subscriptionWentLive: 'subscriptionWentLive',
                subscriptionCreatedScheduledStream: 'subscriptionCreatedScheduledStream',
                subscriptionScheduledStreamStartingIn: 'subscriptionScheduledStreamStartingIn',
                resetPassword: 'resetPassword'
            }
        }
    }
};