FROM node:21-alpine as base

# configure env
ARG MONGO_URI
ARG COOKIE_SECRET_KEY
ARG NEXT_PUBLIC_PW_ENCRYPTION_KEY
ARG NEXT_PUBLIC_PW_ENCRYPTION_IV
ARG MGMT_USERNAME
ARG MGMT_PASSWORD
ARG AWS_REGION
ARG AMPLIFY_BUCKET
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

ENV MONGO_URI=$MONGO_URI 
ENV COOKIE_SECRET_KEY=$COOKIE_SECRET_KEY 
ENV NEXT_PUBLIC_PW_ENCRYPTION_KEY=$NEXT_PUBLIC_PW_ENCRYPTION_KEY 
ENV NEXT_PUBLIC_PW_ENCRYPTION_IV=$NEXT_PUBLIC_PW_ENCRYPTION_IV 
ENV MGMT_USERNAME=$MGMT_USERNAME 
ENV MGMT_PASSWORD=$MGMT_PASSWORD 
ENV AWS_REGION=$AWS_REGION 
ENV AMPLIFY_BUCKET=$AMPLIFY_BUCKET 
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID 
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY 


RUN apk add --no-cache g++ make py3-pip libc6-compat
RUN corepack enable pnpm
WORKDIR /app
COPY package*.json ./


FROM base as builder
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm run build


FROM base as production
WORKDIR /app

ENV NODE_ENV=production
RUN pnpm install

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs


COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["pnpm" "run" "start"]