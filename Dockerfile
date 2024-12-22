FROM node:20-alpine

RUN apk add --no-cache python3 make g++

# Copy the startup script
COPY start.sh /usr/local/bin/start.sh

# Set the command to run the startup script
CMD ["/usr/local/bin/start.sh"]
