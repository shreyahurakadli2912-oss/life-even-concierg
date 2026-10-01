# Use Python 3.11 slim base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Prevent Python from writing .pyc files and buffer outputs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app/backend

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install python dependencies
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy backend code, data, and entrypoint script
COPY backend/ /app/backend/
COPY data/ /app/data/
COPY entrypoint_aikart.py /app/entrypoint_aikart.py

# Create /aikart directory for sandbox input/output JSON files
RUN mkdir -p /aikart && chmod 777 /aikart

# Default command for aiKart sandbox execution
CMD ["python", "entrypoint_aikart.py"]
