ARG node=node:11
ARG target=node:11

# Build frontend
FROM $node as frontend
WORKDIR /app
ARG NODE_ENV
ARG REACT_APP_BACKEND_URL
ENV NODE_ENV $NODE_ENV
ENV REACT_APP_BACKEND_URL $REACT_APP_BACKEND_URL
COPY frontend/package.json .
RUN npm install --quiet
COPY frontend/ .
RUN npm run build

# Build backend
FROM $node as backend
ARG NODE_ENV
ARG REACT_APP_BACKEND_URL
ENV NODE_ENV $NODE_ENV
ENV REACT_APP_BACKEND_URL $REACT_APP_BACKEND_URL
WORKDIR /app
COPY backend/package.json .
RUN npm install --quiet
COPY backend/ .

# Put them together
FROM $node as proddeps
ARG NODE_ENV
ARG REACT_APP_BACKEND_URL
ENV NODE_ENV $NODE_ENV
ENV REACT_APP_BACKEND_URL $REACT_APP_BACKEND_URL
WORKDIR /app
EXPOSE 4000
COPY --from=backend /app /app
COPY --from=frontend /app/build /app/build
RUN npm install --quiet
CMD  npm run start
