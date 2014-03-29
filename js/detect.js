// Detects language, OS version, and architecture to pre-select the dropdowns
function detectLanguage() {

}

function detectOS() {
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
