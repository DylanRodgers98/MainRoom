# Use long term support image for Node.js on Alpine Linux as parent image
FROM node:lts-alpine

# Install ffmpeg
RUN apk add ffmpeg

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY . .
RUN npm install && \
    npm run webpack:prod && \
    npm prune --production && \
    rm -r client

# Expose HTTP server on port 8080, and RTMP server on port 1935
EXPOSE 8080
EXPOSE 1935

# Start command
CMD [ "npm", "run", "start:prod" ]
