#!/bin/sh

# Install dependencies
yarn

# Run Prisma migrations
npx prisma migrate deploy

# Start the application
yarn run start
