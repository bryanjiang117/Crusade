# Build frontend 

FROM node:18-alpine AS frontend-build

WORKDIR /app
COPY . .

WORKDIR /app/client
RUN npm install
RUN npm run build


FROM python:3.12.6-slim

WORKDIR /app 
COPY . .

WORKDIR /app/server
RUN pip3 install -r requirements.txt


WORKDIR /app

# Copy the built frontend files from the frontend-build stage to the backend container
COPY --from=frontend-build /app/client/dist /app/dist

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Define environment variable
ENV PORT=8080

# Run the application using Gunicorn
CMD ["gunicorn", "-b", ":8080", "server.app:app"]
