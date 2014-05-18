#!/bin/bash

# This is a work in progress. When this message has been removed, it is ready to use.
"""
Thank you, Remco.

We're seeking to create a script which allows each instance of the download site to be turned into a mirror. Ideally, someone can use git clone, run setup.sh, and have a working download mirror fully configured.

setup.sh should:
1. Pull the contents of Tor’s website mirror (or even just dist/torbrowser if possible, since that's all we need)

2. Check the GPG keys to make sure that nothing has been modified

3. Move the download files into a mirror directory and update the URLs found in thank-you.js

4. Ensure that the mirror and the git repo will auto update using cron and will work across version numbers

The current script in the repository has a rough sketch of what I was going for.

Thanks for your help! Open up a pull request whenever you're ready. Feel free to ask us if you have any questions.
"""

# verify ssh server
# verify individual files with keys

echo $0
echo `pwd`

echo "Creating Tor Browser mirror."

MIRROR_URL=rsync://rsync.torproject.org/website-mirror/dist/torbrowser/
TARGET_DIR=tor-mirror/
DIST_FOLDER=dist/torbrowser/

# check version
VERSION = `ls $DIST_FOLDER | tail -n 1`

# If there is an update, check for the latest version of the Tor Browser
#cd $DIST_FOLDER
#VERSION=`ls`
#if [ ! -z $VERSION ]
#then

echo "Rsyncing files to $DIST_FOLDER."
mkdir -p $DIST_FOLDER

# test for rsync progress2 support
rsync --info=progress2 >/dev/null 2>&1
if [ $? -gt 0 ]
then
    rsync -av --delete $MIRROR_URL $TARGET_DIR
else
    rsync -av --info=progress2 --delete $MIRROR_URL $TARGET_DIR
fi

if [ $? -gt 0 ]
then
    echo "Error occured during rsync."
    exit 1
fi

echo "Finished rsyncing files to $DIST_FOLDER."

echo "Checking integrity."

# add valid signature from tor signers
# https://www.torproject.org/docs/signing-keys.html.en
gpg --keyserver x-hkp://pool.sks-keyservers.net --recv-keys 0x416F061063FEE659 0x28988BF5 0x19F78451 0x165733EA  0x8D29319A 0x63FEE659 0xF1F5C9B5 0x31B0974B 0x6B4D6475 0x886DDD89 0xC82E00390xE1DEC577 0xE012B42D

# check all signatures, need refinal
find ./ -name "*.asc" -print0| xargs -0 -i{} sh -c "gpg --verify {} > /dev/null 2>1&& echo {} $?"


if [ $? -gt 0 ]
then
    echo "Warning: One or more signatures failed."
    exit 1
fi

echo "Signatures are valid."

# Create mirror/ and move the version directory (e.g. 3.6) into the folder (so the new path is mirror/3.6/)
mkdir -p $TARGET_DIR$VERSION
  
# Update the URLs in thank-you.js to point to the new files on the mirror

# Add auto-updating to cron to run at a specified interval (One hour? Three hours? Six hours?)
echo "Adding update check to crontab (/etc/cron.d/tor-mirror.sh). Checking every 1 hour for updates."
echo "0 * * * * cd `pwd` && sh $0;" > /etc/cron.d/tor-mirror.sh

echo "Finished tor browser mirror."

