# context is the monorepo root

FROM node:22-alpine AS base
RUN apk update
RUN apk add --no-cache libc6-compat

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
COPY package.json .
RUN corepack enable && corepack prepare `node -p "require('./package.json').packageManager"`

FROM base AS pruner
WORKDIR /repo

COPY package.json .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install turbo@`node -p "require('./package.json').devDependencies.turbo"`
COPY . .
RUN pnpm exec turbo prune social --docker --out-dir=pruned

FROM base AS builder
WORKDIR /repo

COPY --from=pruner /repo/pruned/json .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY --from=pruner /repo/pruned/full .
RUN pnpm exec turbo build --filter=social

FROM base AS runner
WORKDIR /repo

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /repo/apps/social/package.json .
COPY --from=builder /repo/apps/social/next.config.ts .
COPY --from=builder --chown=nextjs:nodejs /repo/apps/social/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/apps/social/.next/static ./apps/social/.next/static

ENV PORT=80
ENV HOSTNAME=0.0.0.0
EXPOSE 80

CMD ["node", "apps/social/server.js"]
