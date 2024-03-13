#
#FROM node:16.20.2-slim AS dependencies
#
#WORKDIR /app
#COPY package.json yarn.lock ./
#RUN yarn install --frozen-lockfile
#
#FROM node:16.20.2-slim AS builder
#WORKDIR /app
#
#COPY --from=dependencies /app/node_modules ./node_modules
#COPY . .
#
#RUN yarn build
#
#FROM node:16.20.2-slim AS runner
#
#COPY --from=builder /app/next.config.js ./
#COPY --from=builder /app/public ./public
#COPY --from=builder /app/package.json ./package.json
#
##COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#
#EXPOSE 3000
#ENV PORT 3000
#
#CMD ["node", "server.js"]

FROM node:16-alpine as builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Step 2: Run the application in production mode
FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pages ./pages

EXPOSE 3000

CMD ["yarn", "start"]