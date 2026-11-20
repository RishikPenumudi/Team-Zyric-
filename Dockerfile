# SAHAJ AI - Google Cloud Run Container Specification
FROM python:3.11-slim

# Install system dependencies for OpenCV and image processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency specifications
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Create volume/data directories
RUN mkdir -p /app/data /app/uploads

# Configure environment defaults for Cloud Run
ENV SAHAJ_HOST=0.0.0.0
ENV SAHAJ_PORT=8080
ENV PORT=8080
ENV SAHAJ_HARDWARE_MODE=SIMULATION

EXPOSE 8080

# Cloud Run container entry point
CMD ["python", "run_server.py"]
