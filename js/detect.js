// Detects language, OS version, and architecture to pre-select the dropdowns
function detectLanguage() {

}

function detectOS() {
	// This method is chosen instead of Stoimen's browser detection library, which is used on the current Tor Project download-easy page (found here: http://www.stoimen.com/blog/2009/07/16/jquery-browser-and-os-detection-plugin/).
	// There's no need for us to use browser detection, so we can just detect the OS here instead.
	if (navigator.platform.toLowerCase().indexOf("win") != -1) {
		return "Windows";
	}
	if (navigator.platform.toLowerCase().indexOf("mac") != -1) {
		return "Apple OS X";
	}
	if (navigator.platform.toLowerCase().indexOf("linux") != -1 || navigator.platform.toLowerCase.indexOf("x11") != -1 || navigator.platform.toLowerCase.indexOf("bsd") != -1) {
		return "Unix";
	}
}

function detectArchitecture() {

}
