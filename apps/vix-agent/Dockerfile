FROM python:3.12-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev
COPY vix_agent ./vix_agent
CMD ["uv", "run", "python", "-m", "vix_agent.main", "start"]
