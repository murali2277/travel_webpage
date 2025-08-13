# Use an official Python runtime as a base image
FROM python:3.9-slim-bullseye

# Set the working directory in the container
WORKDIR /app

# Install system dependencies required for psycopg2-binary
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    python3-dev \
    musl-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the working directory
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the working directory
COPY . .

# Expose the port that Gunicorn will listen on
EXPOSE 8000

# Define environment variables
ENV PYTHONUNBUFFERED 1

# Run Gunicorn to serve the Django application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "msk_travels.wsgi:application"]
