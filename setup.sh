#!/bin/bash

# This is a work in progress. When this message has been removed, it is ready to use.

echo "Creating Tor Browser mirror."

MIRROR_URL=rsync://rsync.torproject.org/website-mirror/dist/torbrowser/
TARGET_DIR=tor-mirror/
#/dists/torbrowser/
DIST_DIR=dist/torbrowser/

echo "Updating to latest version from repository."

mkdir -p $TARGET_DIR

if [ -d $TARGET_DIR ]
then
    # clone and update
    git clone https://github.com/wpapper/tor-download-web.git $TARGET_DIR
fi

pushd .
cd $TARGET_DIR
git reset HEAD --hard $TARGET_DIR
git pull
popd

echo "Rsyncing files to $TARGET_DIR$DIST_DIR"

mkdir -p "$TARGET_DIR$DIST_DIR"

# test for rsync progress2 support
rsync --info=progress2 >/dev/null 2>&1

if [ $? -gt 0 ]
then
    rsync -av $MIRROR_URL "$TARGET_DIR$DIST_DIR"
else
    rsync -av --info=progress2 $MIRROR_URL "$TARGET_DIR$DIST_DIR"
fi

if [ $? -gt 0 ]
then
    echo "Error occured during rsync."
    exit 1
fi

echo "Finished rsyncing files"

echo "Checking integrity."

echo "Importing keys."
# https://www.torproject.org/docs/signing-keys.html.en
gpg --keyserver x-hkp://pool.sks-keyservers.net --recv-keys 0x416F061063FEE659 0x28988BF5 0x19F78451 0x165733EA  0x8D29319A 0x63FEE659 0xF1F5C9B5 0x31B0974B 0x6B4D6475 0x886DDD89 0xC82E0039 0xE1DEC577 0xE012B42D

# check all signatures, need refinal
#find "$TARGET_DIR$DIST_DIR" \( -iname "*.asc" ! -iname "sha*.asc" \) -print0| xargs -0 gpg --verify {} 
find "$TARGET_DIR$DIST_DIR" \( -iname "*.asc" ! -iname "sha*.asc" \) -print0| xargs -0 -i{} gpg --verify {} > /dev/null 2>1

if [ $? -gt 0 ]
then
    echo "Warning: One or more signatures failed."
    exit 1
fi

echo "Signatures are valid."

echo "Installing newer version"
sed -e "s/%VERSION/$VERSION/g" "$TARGET_DIRjs/thank-you.js.template" > "$TARGET_DIRjs/thank-you.js"

# Add auto-updating to cron to run at a specified interval (One hour? Three hours? Six hours?)
echo "Adding update check to crontab (/etc/cron.d/tor-mirror.sh). Checking every 1 hour for updates."
echo "0 * * * * cd \"`pwd`$TARGET_DIR\" && sh setup.sh" > /etc/cron.d/tor-mirror.sh

echo "Finished installing tor browser mirror version $VERSION in $TARGET_DIR."

