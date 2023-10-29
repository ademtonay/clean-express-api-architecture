FROM bitnami/node:18 AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .

RUN pnpm install
RUN pnpm build

FROM bitnami/node:18 as prod
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=build /app/dist .
RUN pnpm install

EXPOSE 3000 8080

cmd ["pnpm", "run", "start"]
