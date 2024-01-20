#!/bin/bash
# this is an example of the command that is used to replace the video's audio with the combined mp3 audio
ffmpeg \
-i ./video/abc.mp4 \
-i ./audio/abc/combined.mp3 \
-c:v copy -map 0:v:0 -map 1:a:0 ./video/final.mp4 -y