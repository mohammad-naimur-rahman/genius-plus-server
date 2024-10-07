FROM oven/bun AS build

WORKDIR /app
# Copy all project files
# COPY .env .env
COPY package.json .
COPY . .
# Install dependencies
RUN bun install --frozen-lockfile --ignore-scripts

# --- Stage 2: Production ---
FROM oven/bun AS production

# Set working directory
WORKDIR /app

# Copy built files from the build stage
COPY --from=build /app /app

# Expose port 3000 for the Next.js app
EXPOSE 5000

# Start the bun app
CMD ["bun", "run", "start"]

# build command -> docker build -t naimurrahmandev/genius-plus-server:v1 .
# run command -> docker run --name genius-plus-server -d -p 5000:5000 -t naimurrahmandev/genius-plus-server:v1