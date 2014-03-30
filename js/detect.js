// Detects language, OS version, and architecture to pre-select the dropdowns
function detectLanguage() {
	// Matches the language preference to the closest Tor Browser Bundle language option. For example, if the user's preference is en-GB, en-US will be used instead.
	var language = navigator.language || navigator.userLanguage;
	var startsWithArray = ["en", "ar", "de", "es", "fa", "fr", "it", "nl", "pl", "pt", "ru", "vi", "zh"];
	var returnWithArray = ["en-US", "ar", "de", "es-ES", "fa", "fr", "it", "nl", "pl", "pt-PT", "ru", "vi", "zh-CN"];
 	for (int i = 0; i < startsWith.length; i++) {
 		if (language.startsWith(startsWithArray[i]) {
 			returnWithArray[i];
 		}
 	}		
}

function detectOS() {
	// This method is chosen instead of Stoimen's browser detection library, which is used on the current Tor Project download-easy page (found here: http://www.stoimen.com/blog/2009/07/16/jquery-browser-and-os-detection-plugin/).
	// There's no need for us to use browser detection, so we can just detect the OS here instead.
	var platform = navigator.platform.toLowerCase();
	if (platform.indexOf("win") != -1) {
		return "Windows";
	}
	if (platform.indexOf("mac") != -1) {
		return "Apple OS X";
	}
	if (navigator.platform.toLowerCase().indexOf("linux") != -1 || navigator.platform.toLowerCase.indexOf("x11") != -1 || navigator.platform.toLowerCase.indexOf("bsd") != -1) {
		return "Unix";
	}
}

function detectArchitecture() {

}
