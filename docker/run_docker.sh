#!/bin/bash

docker images | grep imglab:latest

if [ $? -ne 0 ]; then

    # Building docker image
    docker build --rm -t imglab:latest -f docker/Dockerfile .
    
    if [ $? -ne 0 ]; then
        exit 1
    fi
fi

# Run container 
docker run -it \
           -d \
           --rm \
           --name imglab \
           -p 8080:8080 \
           --memory="8g" \
           -w /src/ \
        imglab:latest live-server