#!/bin/bash

# This is a work in progress. When this message has been removed, it is ready to use.

MIRROR_URL=rsync://rsync.torproject.org/website-mirror
TARGET_DIR=tor-mirror/
DIST_FOLDER=dist/torbrowser/

# Use rsync to get the contents of the mirror from torproject.org
rsync -av --delete $MIRROR_URL $TARGET_DIR
cd $TARGET_DIR

# If there is an update, check for the latest version of the Tor Browser
cd $DIST_FOLDER
VERSION=`ls`
if [ ! -z $VERSION ]
then
  # Check the GPG signatures. IMPORTANT: ONLY CONTINUE IF THE SIGNATURES CAN BE SUCCESSFULLY VERIFIED. Otherwise, print an error.
  
  # Create mirror/ and move the version directory (e.g. 3.6) into the folder (so the new path is mirror/3.6/)
  
  # Update the URLs in thank-you.js to point to the new files on the mirror

# Add auto-updating to cron to run at a specified interval (One hour? Three hours? Six hours?)