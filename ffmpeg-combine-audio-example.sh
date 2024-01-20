#!/bin/bash
# this is an example of the command that is used to build the audio file
# notice the delays are in milliseconds
# also notice the normalize is set to 0, this is critical to maintaining the same volume accross all audio files
ffmpeg \
-i ./audio/abc/1.mp3 \
-i ./audio/abc/2.mp3 \
-i ./audio/abc/3.mp3 \
-i ./audio/abc/4.mp3 \
-i ./audio/abc/5.mp3 \
-filter_complex " \
[0]adelay=1000:all=true[a0]; \
[1]adelay=5000:all=true[a1]; \
[2]adelay=12000:all=true[a2]; \
[3]adelay=17000:all=true[a3]; \
[4]adelay=20000:all=true[a4]; \
[a0][a1][a2][a3][a4]amix=inputs=5:normalize=0 [out] \
" \
-map "[out]" \
./audio/abc/combined.mp3 -async 1 -y