#!/bin/bash

docker run -it \
           -d \
           --rm \
           --name imglab \
           -p 8080:8080 \
           -w /src/ \
        francozacco/imglab:latest live-server