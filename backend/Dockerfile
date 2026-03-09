# Use the official uv image for the build stage
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder

# Enable bytecode compilation for faster startup
ENV UV_COMPILE_BYTECODE=1

# Copy only the dependency files first to leverage Docker caching
WORKDIR /app
COPY uv.lock pyproject.toml ./

# Install dependencies into a virtualenv (uv creates this automatically)
RUN uv sync --frozen --no-install-project --no-dev

# Final Stage
FROM python:3.12-slim

WORKDIR /app

# Copy the virtual environment from the builder
COPY --from=builder /app/.venv /app/.venv

# Ensure the app uses the virtualenv's python and binaries
ENV PATH="/app/.venv/bin:$PATH"

# Copy your FastAPI code
COPY . .

# Run the app
CMD ["python", "main.py"]