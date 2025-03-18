ARG NGNIX_VERSION=mainline-alpine3.21

FROM nginxinc/nginx-unprivileged:$NGNIX_VERSION AS app

USER root
COPY .output/public /usr/share/nginx/html/

USER nginx

ARG BUILD_TIME
ARG GIT_COMMIT_SHA
ARG GIT_CURRENT_BRANCH
ARG GIT_LAST_LOG_MESSAGE
ARG GIT_LAST_COMMITTER
ARG GIT_LAST_COMMIT_DATE

LABEL org.opencontainers.image.created="$BUILD_TIME"
LABEL org.opencontainers.image.url="https://hive.io/"
LABEL org.opencontainers.image.documentation="https://gitlab.syncad.com/hive/tx-inspector"
LABEL org.opencontainers.image.source="https://gitlab.syncad.com/hive/tx-inspector"
#LABEL org.opencontainers.image.version="${VERSION}"
LABEL org.opencontainers.image.revision="$GIT_COMMIT_SHA"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.ref.name="Transaction Inspector Application"
LABEL org.opencontainers.image.title="Transaction Inspector Application Image"
LABEL org.opencontainers.image.description="Runs transaction inspector applicaton)"
LABEL io.hive.image.branch="$GIT_CURRENT_BRANCH"
LABEL io.hive.image.commit.log_message="$GIT_LAST_LOG_MESSAGE"
LABEL io.hive.image.commit.author="$GIT_LAST_COMMITTER"
LABEL io.hive.image.commit.date="$GIT_LAST_COMMIT_DATE"
