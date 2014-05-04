$(document).ready(function() {
	//HIDE SHOW FOR SIGNATURES
	$('#sig-info').hide();
	if (!checkBackButton()) {
		detectParameters();
		markBackButton();
	}
});


function detectParameters() {
	var os = getQueryVariable("os");
	var language = getQueryVariable("lang");
	setDownload(language, os);
}

function setDownload(language, os) {
	// Values taken from the source code of https://github.com/glamrock/tbb-bin
	//https://github.com/glamrock/tbb-bin/blob/master/torbrowser-install-3.6_es-ES.exe?raw=true
	var wintbb = 'https://github.com/glamrock/tbb-bin/blob/master/torbrowser-install-3.6_'
			+ language + '.exe?raw=true';
	var wintbbsig = 'https://www.torproject.org/dist/torbrowser/3.6/torbrowser-install-3.6_'
			+ language + '.exe.asc';
	//https://github.com/glamrock/tbb-bin/blob/master/TorBrowser-3.6-osx32_en-US.dmg?raw=true
	var osxtbb32 = 'https://github.com/glamrock/tbb-bin/blob/master/TorBrowser-3.6-osx32_'
			+ language + '.dmg?raw=true';
	var osxtbb32sig = 'https://www.torproject.org/dist/torbrowser/3.6/TorBrowser-3.6-osx32_'
			+ language + '.dmg.asc';
	// Apparently there is no 64-bit OS X download, even though it's in the source of the Tor Project's "All Downloads" page:
	// var osxtbb64 = 'https://www.torproject.org/dist/torbrowser/3.6/TorBrowserBundle-3.6-osx64_' + language + '.zip';
	
	//https://github.com/glamrock/tbb-bin/blob/master/tor-browser-linux32-3.6_en-US.tar.xz?raw=true
	var lintbb32 = 'https://github.com/glamrock/tbb-bin/blob/master/tor-browser-linux32-3.6_'
			+ language + '.tar.xz?raw=true';
	var lintbb32sig = 'https://www.torproject.org/dist/torbrowser/3.6/tor-browser-linux32-3.6_'
			+ language + '.tar.xz.asc';
	//https://github.com/glamrock/tbb-bin/blob/master/tor-browser-linux64-3.6_en-US.tar.xz?raw=true
	var lintbb64 = 'https://github.com/glamrock/tbb-bin/blob/master/tor-browser-linux64-3.6_'
			+ language + '.tar.xz?raw=true';
	var lintbb64sig = 'https://www.torproject.org/dist/torbrowser/3.6/tor-browser-linux64-3.6_'
			+ language + '.tar.xz.asc';
	if (os !== undefined && os !== null) {
		if (os.indexOf("windows") !== -1) {
			$("#download-url").val(os).attr("src", wintbb);
			$("#sig-url").val(os).attr("href", wintbbsig);
		} else if (os.indexOf("osx") !== -1) {
			$("#download-url").val(os).attr("src", osxtbb32);
			$("#sig-url").val(os).attr("href", osxtbb32sig);
		}
		// No 64-bit OS X version seems to exist
		// else if (os.indexOf("Apple OS X") != -1 && architecture.indexOf("64-bit") != -1) {
		// $("#download-url").val(os).attr("href", osxtbb64);
		// }
		else if (os.indexOf("linux32") !== -1) {
			$("#download-url").val(os).attr("src", lintbb32);
			$("#sig-url").val(os).attr("href", lintbb32sig);
		} else if (os.indexOf("linux64") !== -1) {
			$("#download-url").val(os).attr("src", lintbb64);
			$("#sig-url").val(os).attr("href", lintbb64sig);
		}
	}
}

// Check if the user got to the page by pressing the back button
// If they have not gotten to the page by pressing the back button, then return false
// If they have used the back button, return true
function checkBackButton() {
	var backButton = document.getElementById("check-back-button-input").value;
	if (backButton === "false") {
		return false;
	} else if (backButton === "true") {
		return true;
	}
}

// Mark the page to indicate that the user has already visited it
function markBackButton() {
	$("#check-back-button-input").val("true");
}

// Function is from here: http://css-tricks.com/snippets/javascript/get-url-variables/
function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for ( var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return (false);
}
var infoClicks = 1;
function toggleInfo(){
	$('#sig-info').toggle();
	if(infoClicks%2 == 1){
		$('#changeText').text('Hide');
		infoClicks++;
	}
	else{
		$('#changeText').text('What is this?');
		infoClicks++;
	}
}