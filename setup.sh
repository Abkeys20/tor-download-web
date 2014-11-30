#!/bin/bash

# This is a work in progress. When this message has been removed, it is ready to use.

echo "Creating Tor Browser mirror."

MIRROR_URL=rsync://rsync.torproject.org/website-mirror/dist/torbrowser/
TARGET_DIR=tor-mirror/
#/dists/torbrowser/
DIST_DIR=dist/torbrowser/
LOGS_DIR=logs/

echo "Updating to latest version from repository."

mkdir -p $TARGET_DIR

if [ -d $TARGET_DIR ]
then
    # clone and update
    git clone https://github.com/wpapper/tor-download-web.git $TARGET_DIR
fi

git --git-dir="$TARGET_DIR/.gt" reset HEAD
git --git-dir="$TARGET_DIR/.gt" pull

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
# Key Fingerprints are downloaded at launch from torproject.org via an HTTPS connection
wget --quiet -O - https://www.torproject.org/docs/signing-keys.html.en | grep "Key\ fingerprint" | sed 's/.*\=\ //' | tr -d "\ " > "$LOGS_DIRsigning-keys-fingerprints"
if [ -f "$LOGS_DIRsigning-keys-fingerprints" ]; then
    gpg --keyserver hkp://keys.gnupg.net/ --fingerprint --recv-keys "$(cat "$LOGS_DIR/signing-keys-fingerprints")"
else
    echo "Unable to import keys."
    exit 1
fi

echo "Checking for 32bit KeyID duplicates in keyring."
function do_gpgidchk {
    gpg --list-keys --fingerprint | grep "Key\ fingerprint"| sed 's/.*\=\ //' | tr -d "\ " | sed 's/.\{32\}//' | sort | uniq -c | sed 's/^\ *//' | grep -v "^1\ "
    if [ "$?" -eq "0" ]; then
        echo "WARNING: At least two keys in your keyring share 32bit KeyIDs."
        echo "         Double check output of \`gpg --list-keys --fingerprint\`"
        echo "         If you're sure that the KeyID collision is benign (i.e. not malicious) rerun: ${0##*/:-} force"
        echo "         More Info: https://evil32.com/"
        exit 1
    fi
}

if [ "$1" == "force" ]; then
    echo "NOTICE: This script will not test whether or not 32bit KeyIDS for any of the keys in your GPG keyring match."
    echo "        This could be dangerous depending on how you imported your GPG keys. More Info: https://evil32.com/"
else
    do_gpgidchk
fi

# check all signatures, need refinal
find "$TARGET_DIR$DIST_DIR" \( -iname "*.asc" ! -iname "sha*.asc" \) -print0| xargs -0 -i{} gpg --verify {} >> $LOGS_DIRsignature-verify-log 2>1

if [ $? -gt 0 ]
then
    echo "Warning: One or more signatures failed."
    exit 1
fi

echo "Signatures are valid."

echo "Installing newer version"
sed -e "s/%VERSION/$VERSION/g" ""$TARGET_DIR"js/thank-you.js.template" > ""$TARGET_DIR"js/thank-you.js"

# Add auto-updating to cron to run at a specified interval (One hour? Three hours? Six hours?)
echo "Adding update check to crontab (/etc/cron.d/tor-mirror.sh). Checking every 1 hour for updates."
echo "0 * * * * cd \"`pwd`$TARGET_DIR\" && sh setup.sh" > /etc/cron.d/tor-mirror

echo "Finished installing tor browser mirror version $VERSION in $TARGET_DIR."

