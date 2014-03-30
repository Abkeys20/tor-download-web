// Pre-selects the dropdown defaults using jQuery
$(document).on( "pagecreate", function() {
	preSelect();
});

function preSelect() {
	var language = detectLanguage();
	if (language != null) {
		$("#language").val(language).attr("selected", "selected");
		$("#language").selectmenu("refresh");
	}
	var os = detectOS();
	if (os != null) {
		$("#os").val(os).attr("selected", "selected");
		$("#os").selectmenu("refresh");	
	}
	var architecture = detectArchitecture();
	if (archtecture != null) {
		$("#architecture").val(architecture).attr("selected", "selected");
		$("#archtecture").selectmenu("refresh");	
	}
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
 			returnWithArray[i];
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
	}
	else if (platform.indexOf("mac") != -1) {
		return "Apple OS X";
	}
	else if (platform.indexOf("linux") != -1 || platform.indexOf("x11") != -1 || platform.indexOf("bsd") != -1) {
		return "Unix";
	}
	else {
		return null;	
	}
}

function detectArchitecture() {
	// Checks based on testing reported here: http://stackoverflow.com/a/6267019
	platform = navigator.platform;
	cpuClass = navigator.cpuClass;
	if (platform.indexOf("64") != -1) {
		return "64-bit";
	}
	else if ((platform.indexOf("86") != -1 || platform.indexOf("32") != -1) && !platform.indexOf("64") != -1) {
		return "32-bit";
	}
	else {
		return null;
	}
}
