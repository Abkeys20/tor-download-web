#!/bin/bash

# This is a work in progress. When this message has been removed, it is ready to use.

# Use rsync to get the contents of the mirror from torproject.org
rsync -av --delete rsync://rsync.torproject.org/website-mirror tor-mirror/
cd tor-mirror/

# If there is an update, check for the latest version of the Tor Browser
cd dist/torbrowser/
ls

# Check the GPG signatures. IMPORTANT: ONLY CONTINUE IF THE SIGNATURES CAN BE SUCCESSFULLY VERIFIED. Otherwise, print an error.

# Create mirror/ and move the version directory (e.g. 3.6) into the folder (so the new path is mirror/3.6/)

# Update the URLs in thank-you.js to point to the new files on the mirror

# Add auto-updating to cron to run at a specified interval (One hour? Three hours? Six hours?)