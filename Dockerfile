FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .

RUN bun run prisma:generate
RUN bun run build

EXPOSE 3000

CMD ["bun", "start"]