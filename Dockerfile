FROM node:20-slim AS builder

WORKDIR /app

COPY package.json bun.lockb ./
RUN npm install -g bun && bun install --frozen-lockfile

COPY . .

RUN bun next build

FROM node:20-slim AS runner

WORKDIR /app

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json .
COPY --from=builder /app/bun.lockb .
COPY --from=builder /app/drizzle drizzle
COPY --from=builder /app/src/schema src/schema
COPY --from=builder /app/drizzle.config.ts drizzle.config.ts

RUN npm install -g bun && bun install --frozen-lockfile --production

RUN bun add -g drizzle-kit

EXPOSE 3000

CMD ["sh", "-c", "bun x drizzle-kit push --config=drizzle.config.ts && bun start"]
