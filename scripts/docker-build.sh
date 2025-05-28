#!/bin/bash

CONTAINER_NAME=pokeguex
IMAGE_NAME=pokeguex:latest

DEFAULT_PORT=3000
PORT=${1:-$DEFAULT_PORT}

echo "📦 Using port: $PORT"

echo "🔍 Checking if container '$CONTAINER_NAME' is running..."
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "🛑 Stopping the container..."
    docker stop $CONTAINER_NAME
fi

echo "🗑️ Removing container if it exists..."
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    docker rm $CONTAINER_NAME
fi

echo "🔨 Building new image..."
docker build -t $IMAGE_NAME .

echo "🚀 Running the container..."
docker run -d \
  --name $CONTAINER_NAME \
  -p $PORT:3000 \
  $IMAGE_NAME

echo "✅ Container started correctly en el puerto $PORT"
