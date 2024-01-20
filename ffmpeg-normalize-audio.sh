#!/bin/bash
# this is an example of the command that is used normalize the volume of the audio file
ffmpeg \
-i ./audio/abc/combined.mp3 \
-filter:a loudnorm -c:a libmp3lame -q:a 2  ./audio/abc/combined-normalized.mp3 -y