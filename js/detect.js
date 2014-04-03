// Pre-selects the dropdown defaults using jQuery and automatically changes the download button URL
$(document).ready(function() {
	preSelect();

});

function preSelect() {
	var language = detectLanguage();
	if (language !== null) {
		$("select[name=language]").val(language).attr("selected", "selected");
		//$("select[name=language]").selectmenu("refresh");
	}
	var os = detectOS();
	if (os !== null) {
		$("select[name=os]").val(os).attr("selected", "selected");
		//$("select[name=os]").selectmenu("refresh");
	}
	setDownload(language, os);
	initializeChange();
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
	var architecture = detectArchitecture();
	// Check the architecture to ensure that Windows downloads are not being presented to an ARM Surface tablet, for example, or that Intel-based OS X downloads are not being presented to PowerPC Macs
	if (platform.indexOf("win") !== -1 && architecture !== undefined && (architecture.indexOf("32-bit") !== -1 || architecture.indexOf("64-bit") !== -1)) {
		return "Windows";
	} else if (platform.indexOf("mac") !== -1 && architecture !== undefined && (architecture.indexOf("32-bit") !== -1 || architecture.indexOf("64-bit") !== -1)) {
		return "Apple OS X";
	} else if (platform.indexOf("linux") !== -1 || platform.indexOf("x11") !== -1 || platform.indexOf("bsd") !== -1) {
        if (architecture !== undefined) {
            if (architecture.indexOf("32-bit") !== -1) {
                return "Unix 32-bit";
            }
            else if (architecture.indexOf("64-bit") !== -1) {
                return "Unix 64-bit";
            }
            else {
                return null;
            }
        }
	} else {
		return null;
	}
}

function detectArchitecture() {
	// Checks based on testing reported here: http://stackoverflow.com/a/6267019
	var platform = navigator.platform;
	if (platform !== undefined) {
		platform = platform.toLowerCase();
	}
	var cpuClass = navigator.cpuClass;
	if (cpuClass !== undefined) {
		cpuClass = cpuClass.toLowerCase();
	}
	// First check platform, which is a more widely supported value
	if (platform !== undefined) {
		// Needs to detect MacIntel, which signifies 64-bit Macs
		if ((platform.indexOf("86") !== -1 || platform.indexOf("32") !== -1) && !platform.indexOf("64") !== -1) {
			return "32-bit";
		} else if (platform.indexOf("64") !== -1 || platform.indexOf("intel") !== -1) {
			return "64-bit";
		}
	}
	// If nothing useful is found in platform, check cpuClass
	else if (cpuClass !== undefined) {
		if ((cpuClass.indexOf("86") !== -1 || cpuClass.indexOf("32") !== -1) && !cpuClass.indexOf("64") !== -1) {
			return "32-bit";
		} else if (cpuClass.indexOf("64") !== -1 || cpuClass.indexOf("intel") !== -1) {
			return "64-bit";
		}
	} else {
		return null;
	}
}

function setDownload(language, os) {
	// Values taken from the source code of https://www.torproject.org/download/download.html.en
	var wintbb = 'https://www.torproject.org/dist/torbrowser/3.5.3/torbrowser-install-3.5.3_' + language + '.exe';
	var osxtbb32 = 'https://www.torproject.org/dist/torbrowser/3.5.3/TorBrowserBundle-3.5.3-osx32_' + language + '.zip';
	// Apparently there is no 64-bit OS X download, even though it's in the source of the Tor Project's "All Downloads" page:
	// var osxtbb64 = 'https://www.torproject.org/dist/torbrowser/3.5.3/TorBrowserBundle-3.5.3-osx64_' + language + '.zip';
	var lintbb32 = 'https://www.torproject.org/dist/torbrowser/3.5.3/tor-browser-linux32-3.5.3_' + language + '.tar.xz';
	var lintbb64 = 'https://www.torproject.org/dist/torbrowser/3.5.3/tor-browser-linux64-3.5.3_' + language + '.tar.xz';
	if (os.indexOf("Windows") !== -1) {
		$("#download-url").val(os).attr("href", wintbb);
	} else if (os.indexOf("Apple OS X") !== -1) {
		$("#download-url").val(os).attr("href", osxtbb32);
	}
	// No 64-bit OS X version seems to exist
	// else if (os.indexOf("Apple OS X") != -1 && architecture.indexOf("64-bit") != -1) {
	// $("#download-url").val(os).attr("href", osxtbb64);
	// }
	else if (os.indexOf("Unix 32-bit") !== -1) {
		$("#download-url").val(os).attr("href", lintbb32);
	} else if (os.indexOf("Unix 64-bit") !== -1) {
		$("#download-url").val(os).attr("href", lintbb64);
	}
	// Make the language code human-readable
	var languageCodes = ["en-US", "ar", "de", "es-ES", "fa", "fr", "it", "nl", "pl", "pt-PT", "ru", "vi", "zh-CN"];
	var humanReadable = ["English", "&#x0627;&#x0644;&#x0639;&#x0631;&#x0628;&#x064a;&#x0629;", "Deutsch", "&#x0045;&#x0073;&#x0070;&#x0061;&#x00f1;&#x006f;&#x006c;", "&#x0641;&#x0627;&#x0631;&#x0633;&#x06cc;", "&#x0046;&#x0072;&#x0061;&#x006e;&#x00e7;&#x0061;&#x0069;&#x0073;", "Italiano", "Nederlands", "Polish", "&#x0050;&#x006f;&#x0072;&#x0074;&#x0075;&#x0067;&#x0075;&#x00ea;&#x0073;", "&#x0420;&#x0443;&#x0441;&#x0441;&#x043a;&#x0438;&#x0439;", "Vietnamese", "&#x7b80;&#x4f53;&#x5b57;"]
	var humanReadableIndex = languageCodes.indexOf(language);
	if (humanReadableIndex !== undefined) {
		var humanReadableLanguage = humanReadable[humanReadableIndex];
		var aboutDownload = "Tor Browser for " + os + " in " + humanReadableLanguage;
		$("#about-download").text(aboutDownload);
	}
}

function initializeChange() {
	$("select[name=language]").change(onLanguageChange());
	$("select[name=os]").change(onOSChange());
	$("select[name=architecture]").change(onArchitectureChange());
}

function onLanguageChange() {
	var language = $("select[name=language]").val();
	var os = detectOS();
	var architecture = detectArchitecture();
	setDownload(language, os, architecture);
}

function onOSChange() {
	var language = detectLanguage();
	var os = $("select[name=os]").val();
	var architecture = detectArchitecture();
	setDownload(language, os, architecture);
}

function onArchitectureChange() {
	var language = detectLanguage();
	var os = detectOS();
	var architecture = $("select[name=architecture]").val();
	setDownload(language, os, architecture);
}
