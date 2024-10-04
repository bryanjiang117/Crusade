# Use an official Python runtime as a parent image
FROM python:3.12.6-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install any needed packages specified in requirements.txt
RUN pip3 install --no-cache-dir -r requirements.txt

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Define environment variable
ENV PORT=8080

# Run the application using Gunicorn
CMD ["gunicorn", "-b", ":8080", "app:app"]
