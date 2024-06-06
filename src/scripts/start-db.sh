#!/bin/bash

# Replace with your actual Postgres credentials
HOST="localhost"
PORT="5432"
USERNAME="postgres"  # Assuming you have a user named "postgres" with appropriate permissions
PASSWORD="root"

# Connect to Postgres
psql -h "$HOST" -p "$PORT" -U "$USERNAME" -c "CREATE DATABASE \"nestjs-skeleton\""

# Check if the database creation was successful
if [[ $? -eq 0 ]]; then
  echo "Database nestjs-skeleton created successfully!"
else
  echo "Error creating database nestjs-skeleton."
  exit 1
fi
