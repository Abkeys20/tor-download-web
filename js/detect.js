// Pre-selects the dropdown defaults using jQuery and automatically changes the download button URL
$(document).ready(function() {
	preSelect();
});

function preSelect() {
	var language = detectLanguage();
	if (language != null) {
		$("select[name=language]").val(language).attr("selected", "selected");
		//$("select[name=language]").selectmenu("refresh");
	}
	var os = detectOS();
	if (os != null) {
		$("select[name=os]").val(os).attr("selected", "selected");
		//$("select[name=os]").selectmenu("refresh");
	}
	var architecture = detectArchitecture();
	if (architecture != null) {
		$("select[name=architecture]").val(architecture).attr("selected", "selected");
		//$("select[name=archtecture]").selectmenu("refresh");
	}
	setDownload(language, os, architecture);
}

// Detects language, OS version, and architecture to pre-select the dropdowns
function detectLanguage() {
	// Matches the language preference to the closest Tor Browser Bundle language option. For example, if the user's preference is en-GB, en-US will be used instead.
	var language = navigator.language || navigator.userLanguage;
	var startsWithArray = ["en", "ar", "de", "es", "fa", "fr", "it", "nl", "pl", "pt", "ru", "vi", "zh"];
	var returnWithArray = ["en-US", "ar", "de", "es-ES", "fa", "fr", "it", "nl", "pl", "pt-PT", "ru", "vi", "zh-CN"];
	for (var i = 0; i < startsWithArray.length; i++) {
		// Check if the string starts with a given language
		if (language.lastIndexOf(startsWithArray[i], 0) === 0) {
			return returnWithArray[i];
		}
	}
	return null;
}

function detectOS() {
	// This method is chosen instead of Stoimen's browser detection library, which is used on the current Tor Project download-easy page (found here: http://www.stoimen.com/blog/2009/07/16/jquery-browser-and-os-detection-plugin/).
	// There's no need for us to use browser detection, so we can just detect the OS here instead.
	var platform = navigator.platform.toLowerCase();
	if (platform.indexOf("win") != -1) {
		return "Windows";
	} else if (platform.indexOf("mac") != -1) {
		return "Apple OS X";
	} else if (platform.indexOf("linux") != -1 || platform.indexOf("x11") != -1 || platform.indexOf("bsd") != -1) {
		return "Unix";
	} else {
		return null;
	}
}

function detectArchitecture() {
	// Checks based on testing reported here: http://stackoverflow.com/a/6267019
	platform = navigator.platform;
	if (platform !== undefined) {
		platform = platform.toLowerCase();
	}
	cpuClass = navigator.cpuClass;
	if (cpuClass !== undefined) {
		cpuClass = cpuClass.toLowerCase();
	}
	// First check platform, which is a more widely supported value
	if (platform !== undefined) {
		// Needs to detect MacIntel, which signifies 64-bit Macs
		if ((platform.indexOf("86") != -1 || platform.indexOf("32") != -1) && !platform.indexOf("64") != -1) {
			return "32-bit";
		} else if (platform.indexOf("64") != -1 || platform.indexOf("intel")) {
			return "64-bit";
		}
	}
	// If nothing useful is found in platform, check cpuClass
	else if (cpuClass !== undefined) {
		if ((cpuClass.indexOf("86") != -1 || cpuClass.indexOf("32") != -1) && !cpuClass.indexOf("64") != -1) {
			return "32-bit";
		} else if (cpuClass.indexOf("64") != -1 || cpuClass.indexOf("intel")) {
			return "64-bit";
		}
	} else {
		return null;
	}
}

function setDownload(language, os, architecture) {
	// Values taken from the source code of https://www.torproject.org/download/download.html.en
	var wintbb = 'https://www.torproject.org/dist/torbrowser/3.5.3/torbrowser-install-3.5.3_' + language + '.exe';
	var osxtbb32 = 'https://www.torproject.org/dist/torbrowser/3.5.3/TorBrowserBundle-3.5.3-osx32_' + language + '.zip';
	// Apparently there is no 64-bit OS X download, even though it's in the source of the Tor Project's "All Downloads" page:
	// var osxtbb64 = 'https://www.torproject.org/dist/torbrowser/3.5.3/TorBrowserBundle-3.5.3-osx64_' + language + '.zip';
	var lintbb32 = 'https://www.torproject.org/dist/torbrowser/3.5.3/tor-browser-linux32-3.5.3_' + language + '.tar.xz';
	var lintbb64 = 'https://www.torproject.org/dist/torbrowser/3.5.3/tor-browser-linux64-3.5.3_' + language + '.tar.xz';
	if (os.indexOf("Windows") != -1) {
		$("#download-url").val(os).attr("href", wintbb);
	} else if (os.indexOf("Apple OS X") != -1) {
		$("#download-url").val(os).attr("href", osxtbb32);
	}
	/* // No 64-bit OS X version seems to exist else
	  if (os.indexOf("Apple OS X") != -1 && architecture.indexOf("64-bit") != -1) {
	 $("#download-url").val(os).attr("href", osxtbb64);
	 }
	 */
	else if (os.indexOf("Unix") != -1 && architecture.indexOf("32-bit") != -1) {
		$("#download-url").val(os).attr("href", lintbb32);
	} else if (os.indexOf("Unix") != -1 && architecture.indexOf("64-bit") != -1) {
		$("#download-url").val(os).attr("href", lintbb64);
	}
}

function initializeChange() {
	$("select[name=language]").change(onLanguageChange());
	$("select[name=os]").change(onOSChange());
	$("select[name=architecture]").change(onArchitectureChange());
	$("select[name=release]").change(onReleaseChange());
}

function onLanguageChange() {

}

function onOSChange() {

}

function onArchitectureChange() {

}

function onReleaseChange() {

}
