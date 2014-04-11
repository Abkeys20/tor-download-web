// Pre-selects the dropdown defaults using jQuery and automatically changes the download button URL
$(document).ready(function() {
	preSelect();
});
var templang;
var tempos;
var langHighlightBool;
var osHighlightBool;
function preSelect() {
    $("select[name=language]").prop('selectedIndex', -1)
    $("select[name=os]").prop('selectedIndex', -1)
	var language = detectLanguage();
	templang = language;
	if (language !== null) {
		$("select[name=language]").val(language).attr("selected", "selected");
		langchanger(language);
	}
	var os = detectOS();
	tempos = os;
	if (os !== null) {
		$("select[name=os]").val(os).attr("selected", "selected");
	}
	setDownload(language, os);
}

// Detects language, OS version, and architecture to pre-select the dropdowns
function detectLanguage() {
	// Matches the language preference to the closest Tor Browser language option. For example, if the user's preference is en-GB, en-US will be used instead.
	var language = navigator.language || navigator.userLanguage;
	var startsWithArray = ["en", "ar", "de", "es", "fa", "fr", "it", "nl", "pl", "pt", "ru", "vi", "zh"];
	var returnWithArray = ["en-US", "ar", "de", "es-ES", "fa", "fr", "it", "nl", "pl", "pt-PT", "ru", "vi", "zh-CN"];
	for (var i = 0; i < startsWithArray.length; i++) {
		// Check if the string starts with a given language
		if (language.lastIndexOf(startsWithArray[i], 0) === 0) {
			return returnWithArray[i];
		}
	}
	langHighlight();
	return null;
}

function detectOS() {
	// This method is chosen instead of Stoimen's browser detection library, which is used on the current Tor Project download-easy page (found here: http://www.stoimen.com/blog/2009/07/16/jquery-browser-and-os-detection-plugin/).
	// There's no need for us to use browser detection, so we can just detect the OS here instead.
	var platform = navigator.platform.toLowerCase();
	var architecture = detectArchitecture();
	// Check the architecture to ensure that Windows downloads are not being presented to an ARM Surface tablet, for example, or that Intel-based OS X downloads are not being presented to PowerPC Macs
	if (platform.indexOf("win") !== -1 && architecture !== undefined && (architecture.indexOf("32-bit") !== -1 || architecture.indexOf("64-bit") !== -1)) {
		return "Microsoft Windows";
	} else if (platform.indexOf("mac") !== -1 && architecture !== undefined && (architecture.indexOf("32-bit") !== -1 || architecture.indexOf("64-bit") !== -1)) {
		return "Apple OS X";
	} else if (platform.indexOf("linux") !== -1 || platform.indexOf("x11") !== -1 || platform.indexOf("bsd") !== -1) {
		if (architecture !== undefined) {
			if (architecture.indexOf("32-bit") !== -1) {
				return "Linux/BSD 32-bit";
			} else if (architecture.indexOf("64-bit") !== -1) {
				return "Linux/BSD 64-bit";
			}
		}
	}
	// If nothing has been returned yet, then no OS has been detected
	osHighlight();
	return null;
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
	}
}

function setThankYou(language, os) {
    var thankYouString = "?os=";
    if (os !== undefined && os !== null) {
        if (os.indexOf("Microsoft Windows") !== -1) {
            thankYouString += "windows";
        } else if (os.indexOf("Apple OS X") !== -1) {
            thankYouString += "osx";
        }
        else if (os.indexOf("Linux/BSD 32-bit") !== -1) {
            thankYouString += "linux32";
        } else if (os.indexOf("Linux/BSD 64-bit") !== -1) {
            thankYouString += "linux64";
        }
        if (language !== undefined && language !== null) {
            // Separate the string and add the language code
            thankYouString += "&lang=" + language;
            }
        }
    }
    $("#download-url").val(os).attr("href", "thankyou.html" + thankYouString);
}

function setDownload(language, os) {
	// Values taken from the source code of https://www.torproject.org/download/download.html.en
	var wintbb = 'https://www.torproject.org/dist/torbrowser/3.5.4/torbrowser-install-3.5.4_' + language + '.exe';
	var wintbbsig = 'https://www.torproject.org/dist/torbrowser/3.5.4/torbrowser-install-3.5.4_' + language + '.exe.asc';
	var osxtbb32 = 'https://www.torproject.org/dist/torbrowser/3.5.4/TorBrowserBundle-3.5.4-osx32_' + language + '.zip';
	var osxtbb32sig = 'https://www.torproject.org/dist/torbrowser/3.5.4/TorBrowserBundle-3.5.4-osx32_' + language + '.zip.asc';
	// Apparently there is no 64-bit OS X download, even though it's in the source of the Tor Project's "All Downloads" page:
	// var osxtbb64 = 'https://www.torproject.org/dist/torbrowser/3.5.4/TorBrowserBundle-3.5.4-osx64_' + language + '.zip';
	var lintbb32 = 'https://www.torproject.org/dist/torbrowser/3.5.4/tor-browser-linux32-3.5.4_' + language + '.tar.xz';
	var lintbb32sig = 'https://www.torproject.org/dist/torbrowser/3.5.4/tor-browser-linux32-3.5.4_' + language + '.tar.xz.asc';
	var lintbb64 = 'https://www.torproject.org/dist/torbrowser/3.5.4/tor-browser-linux64-3.5.4_' + language + '.tar.xz';
	var lintbb64sig = 'https://www.torproject.org/dist/torbrowser/3.5.4/tor-browser-linux64-3.5.4_' + language + '.tar.xz.asc';
	if (os !== undefined && os !== null) {
		if (os.indexOf("Microsoft Windows") !== -1) {
			$("#download-url").val(os).attr("href", wintbb);
			$("#sig-url").val(os).attr("href", wintbbsig);
		} else if (os.indexOf("Apple OS X") !== -1) {
			$("#download-url").val(os).attr("href", osxtbb32);
			$("#sig-url").val(os).attr("href", osxtbb32sig);
		}
		// No 64-bit OS X version seems to exist
		// else if (os.indexOf("Apple OS X") != -1 && architecture.indexOf("64-bit") != -1) {
		// $("#download-url").val(os).attr("href", osxtbb64);
		// }
		else if (os.indexOf("Linux/BSD 32-bit") !== -1) {
			$("#download-url").val(os).attr("href", lintbb32);
			$("#sig-url").val(os).attr("href", lintbb32sig);
		} else if (os.indexOf("Linux/BSD 64-bit") !== -1) {
			$("#download-url").val(os).attr("href", lintbb64);
			$("#sig-url").val(os).attr("href", lintbb64sig);
		}
		if (language !== undefined && language !== null) {
			// Make the language code human-readable
			var languageCodes = ["en-US", "ar", "de", "es-ES", "fa", "fr", "it", "nl", "pl", "pt-PT", "ru", "vi", "zh-CN"];
			var ar_lang = String.fromCharCode(1575, 1604, 1593, 1585, 1576, 1610, 1577);
			//"&#x0627;&#x0644;&#x0639;&#x0631;&#x0628;&#x064a;&#x0629;"
			var fr_lang = String.fromCharCode(70, 114, 97, 110, 231, 97, 105, 115);
			//"&#x0046;&#x0072;&#x0061;&#x006e;&#x00e7;&#x0061;&#x0069;&#x0073;"
			var fa_lang = String.fromCharCode(1601, 1575, 1585, 1587, 1740);
			//&#x0641;&#x0627;&#x0631;&#x0633;&#x06cc;
			var pt_lang = String.fromCharCode(80, 111, 114, 116, 117, 103, 117, 234, 115);
			//"&#x0050;&#x006f;&#x0072;&#x0074;&#x0075;&#x0067;&#x0075;&#x00ea;&#x0073;"
			var ru_lang = String.fromCharCode(1056, 1091, 1089, 1089, 1082, 1080, 1081);
			//&#x0420;&#x0443;&#x0441;&#x0441;&#x043a;&#x0438;&#x0439;
			var zh_lang = String.fromCharCode(31616, 20307, 23383);
			//"&#x7b80;&#x4f53;&#x5b57;"
			var humanReadable = ["English", ar_lang, "Deutsch", "Español", fa_lang, fr_lang, "Italiano", "Nederlands", "Polish", pt_lang, ru_lang, "Vietnamese", zh_lang]
			var humanReadableIndex = languageCodes.indexOf(language);
			if (humanReadableIndex !== undefined) {
				var humanReadableLanguage = humanReadable[humanReadableIndex];
				var aboutDownload = "For " + os + " in " + humanReadableLanguage;
				$("#about-download").text(aboutDownload);
			}
		}
	}
}

function onLanguageChange() {
	var language = $("select[name=language]").val();
	templang = language;
	langchanger(language);
	var os = tempos;
	setDownload(language, os);
	if (langHighlightBool === true) {
		$("lang_selector").removeClass("dropdown-warning");
		langHighlightBool = false;
	}
}

function onOSChange() {
	var language = templang;
	var os = $("select[name=os]").val();
	tempos = os;
	setDownload(language, os);
	if (osHighlightBool === true) {
		$("#os_selector").removeClass("dropdown-warning");
		osHighlightBool = false;
	}
}

function osHighlight() {
	$("#os_selector").addClass("dropdown-warning");
	osHighlightBool = true;
}

function langHighlight() {
	$("lang_selector").addClass("dropdown-warning");
	langHighlightBool = true;
}

function alertNoDownload() {
    if ($("#download-url").attr("href").indexOf("#") === 0) {
    	$( "#download-button" ).effect( "shake" , "slow" );
        addDownloadWarning();
        setTimeout(removeDownloadWarning, 1000);
    }
    else {
        $('#javascript_on_wrapper').hide();
        $('#thankyou_wrapper').show();
    }
}

function addDownloadWarning() {
    $("#about-download").addClass("about-download-warning");
}

function removeDownloadWarning() {
    $("#about-download").removeClass("about-download-warning");
}
function langchanger(language){
			//LanguageCodes
			var languageCodes = ["en-US", "ar", "de", "es-ES", "fa", "fr", "it", "nl", "pl", "pt-PT", "ru", "vi", "zh-CN"];
			//Tor Text Above Button...
				var ar_hero = String.fromCharCode(1578,1581,1605,1610,1604,32,1605,1578,1589,1601,1581,32,84,111,114);
				//&#1578;&#1581;&#1605;&#1610;&#1604;&#32;&#1605;&#1578;&#1589;&#1601;&#1581;&#32;&#84;&#111;&#114;
				var fa_hero = String.fromCharCode(1605,1585,1608,1585,1711,1585,32,84,111,114,32,1583,1575,1606,1604,1608,1583,32,1705,1606,1740,1583);
				//&#1605;&#1585;&#1608;&#1585;&#1711;&#1585;&#32;&#84;&#111;&#114;&#32;&#1583;&#1575;&#1606;&#1604;&#1608;&#1583;&#32;&#1705;&#1606;&#1740;&#1583;
			var downloadTorText = ["Download Tor Browser", ar_hero, "Laden Sie die Tor-Browser", "Descargar Tor Browser", fa_hero, "Télécharger le navigateur Tor", "Scaricare Tor Browser", "Downloaden van de Tor Browser", "Pobierz Tor Browser", "Baixar o navegador Tor", "скачать обозревателя Tor", "Tải về trình duyệt Tor", "下载Tor浏览器"];
			//Tor Download Button Text
				var ar_download = String.fromCharCode(1578,1606,1586,1610,1604);
				//&#1578;&#1606;&#1586;&#1610;&#1604;
				var fa_download = String.fromCharCode(1583,1575,1606,1604,1608,1583);
				//&#1583;&#1575;&#1606;&#1604;&#1608;&#1583;
			var downloadButton = ["Download",ar_download,"Herunterladen","Descargar",fa_download,"Télécharger","Scaricare","Downloaden","ściąganie","Baixar","скачать","Tải về","下载"];
			//"Looking for something else? Select other options:"
				var ar_options = String.fromCharCode(1578,1581,1583,1610,1583,32,1582,1610,1575,1578,32,1571,1582,1585,1609,58);
				//&#1578;&#1581;&#1583;&#1610;&#1583;&#32;&#1582;&#1610;&#1575;&#1585;&#1575;&#1578;&#32;&#1571;&#1582;&#1585;&#1609;&#58;
				var fa_options = String.fromCharCode(1575,1606,1578,1582,1575,1576,32,1711,1586,1740,1606,1607,32,1607,1575,1740,32,1583,1740,1711,1585,58);
				//&#1575;&#1606;&#1578;&#1582;&#1575;&#1576;&#32;&#1711;&#1586;&#1740;&#1606;&#1607;&#32;&#1607;&#1575;&#1740;&#32;&#1583;&#1740;&#1711;&#1585;&#58;
			var otherOptions = ["Looking for something else? Select other options:",ar_options, "Wählen Sie weitere Optionen:","Seleccione otras opciones:",fa_options,"Sélectionnez d'autres options:","Selezionare altre opzioni:","Selecteer andere opties:","Wybierz inne opcje:","Selecione outras opções:","Выберите другие параметры:","Chọn các tùy chọn khác:","选择其他选项："];
			//About Tor
				var ar_about = String.fromCharCode(1581,1608,1604,32,84,111,114);
				//&#1581;&#1608;&#1604; (84,111,114)
				var fa_about = String.fromCharCode(1583,1585,32,1581,1583,1608,1583,32,84,111,114);
				//&#1583;&#1585;&#32;&#1581;&#1583;&#1608;&#1583; (84,111,114)
			var aboutText = ["About Tor",ar_about,"Über Tor","Acerca de Tor",fa_about,"À propos de Tor","A proposito di Tor","over Tor","o Tor","sobre o Tor","О Tor","Về Tor","关于Tor"];
			//Donate
				var ar_donate = String.fromCharCode(1578,1576,1585,1593);
				//&#1578;&#1576;&#1585;&#1593;
				var fa_donate = String.fromCharCode(1576,1582,1588,1740,1583,1606);
				//&#1576;&#1582;&#1588;&#1740;&#1583;&#1606;
			var donateBtn = ["Donate",ar_donate,"Spenden","Donar",fa_donate,"Donner","Donare","Schenken","Darować","Doar","жертвовать","Tặng","捐赠"];
			//"Want to test a beta Tor Browser?"
				var ar_beta = String.fromCharCode(1605,1578,1589,1601,1581,32,1575,1604,1578,1580,1585,1601,1576,1610,1577);
				//&#1605;&#1578;&#1589;&#1601;&#1581;&#32;&#1575;&#1604;&#1578;&#1580;&#1585;&#1610;&#1576;&#1610;&#1577;
				var fa_beta = String.fromCharCode(1605,1585,1608,1585,1711,1585,32,1578,1580,1585,1576,1740);
				//&#1605;&#1585;&#1608;&#1585;&#1711;&#1585;&#32;&#1578;&#1580;&#1585;&#1576;&#1740;
			var betaBtn = ["Want to test a beta Tor Browser? ",ar_beta,"Experimentellen Browser","Navegador Experimental",fa_beta,"Navigateur Expérimental","Browser Sperimentale","Experimentele Browser","Przeglądarka Eksperymentalna","Navegador Experimental","экспериментальная браузера","Trình duyệt thử nghiệm","实验浏览器"];
			//"Thank you for Downloading"
				var ar_thanks = String.fromCharCode(1588,1603,1585,1575);
				//&#1588;&#1603;&#1585;&#1575;
				var fa_thanks = String.fromCharCode(46,1605,1578,1588,1705,1585,1605);
				//&#46;&#1605;&#1578;&#1588;&#1705;&#1585;&#1605;
			var thanksBtn = ["Thank You for Downloading",ar_thanks,"Danke","Gracias",fa_thanks,"Merci","Grazie","Dank U","Dziękuję","Obrigado","Спасибо","Cảm ơn Bạn","谢谢"]
			//"Verify Signatures"
				var ar_sig = String.fromCharCode(1575,1604,1578,1581,1602,1602,32,1605,1606,32,1575,1604,1578,1608,1602,1610,1593,1575,1578);
				//&#1575;&#1604;&#1578;&#1581;&#1602;&#1602;&#32;&#1605;&#1606;&#32;&#1575;&#1604;&#1578;&#1608;&#1602;&#1610;&#1593;&#1575;&#1578;
				var fa_sig = String.fromCharCode(1576,1585,1585,1587,1740,32,1705,1583,1607,1575,1740,32,1605,1580,1608,1586);
				//&#1576;&#1585;&#1585;&#1587;&#1740;&#32;&#1705;&#1583;&#1607;&#1575;&#1740;&#32;&#1605;&#1580;&#1608;&#1586;
			var sigBtn = ["Verify Signatures", ar_sig, "Überprüfen Signaturen", "Verificar Firmas", fa_sig, "Authentifier les Signatures", "Verificare le Firme", "Handtekeningen Verifiëren", "Weryfikacji Podpisów", "Verificar Assinaturas", "проверки подписей", "Xác minh Chữ Ký", "验证签名"];
			//"What is this?"
				var ar_what = String.fromCharCode(1605,1575,32,1607,1584,1575,1567);
				//&#1605;&#1575;&#32;&#1607;&#1584;&#1575;&#1567;
				var fa_what = String.fromCharCode(1575,1740,1606,32,1670,1740,1587,1578,1567);
				//&#1575;&#1740;&#1606;&#32;&#1670;&#1740;&#1587;&#1578;&#1567;
			var whatBtn = ["What is this?",ar_what,"Was ist das?","¿Qué es esto?",fa_what,"Qu'est-ce que c'est?","Che cos'è questo?","Wat is dit?","Co to jest?","O que é isso?","Что это?","Đây là những gì?","这是什么？"]
			//"Other Tor Services"
				var ar_other = String.fromCharCode(1582,1583,1605,1575,1578,32,1571,1582,1585,1609);
				//&#1582;&#1583;&#1605;&#1575;&#1578;&#32;&#1571;&#1582;&#1585;&#1609;
				var fa_other = String.fromCharCode(1587,1575,1740,1585,32,1582,1583,1605,1575,1578);
				//&#1587;&#1575;&#1740;&#1585;&#32;&#1582;&#1583;&#1605;&#1575;&#1578;
			var otherBtn = ["Other Tor Services", ar_other, "Andere Dienstleistungen", "Otros Servicios", fa_options, "Autres Services","Altri Servizi","Overige Diensten","Inne Usługi","outros Serviços","Прочие услуги","Các Dịch Vụ Khác","其他服务"]
			//"Help Using Tor"
				var ar_help = String.fromCharCode();
				//
				var fa_help = String.fromCharCode();
				//
			var helpBtn = ["Help Using Tor"]
			//jQuery Switcher;
			var humanReadableIndex = languageCodes.indexOf(language);
			if (humanReadableIndex !== undefined) {
				var torHero = downloadTorText[humanReadableIndex];
				$("#download-tor-hero").text(torHero);
				var torDownload = downloadButton[humanReadableIndex];
				$("#download-url").text(torDownload);
				var otherOpt = otherOptions[humanReadableIndex];
				$("#otherOptions").text(otherOpt);
				var aboutButton = aboutText[humanReadableIndex];
				$("#aboutTor").text(aboutButton);
				$("#aboutTor2").text(aboutButton);
				var donateText = donateBtn[humanReadableIndex];
				$("#donateButton").text(donateText);
				$("#donateButton2").text(donateText);
				$("#donateButton3").text(donateText);
				var betaText = betaBtn[humanReadableIndex];
				$("#beta").text(betaText);
				var thankText = thanksBtn[humanReadableIndex];
				$("#thanks").text(thankText);
				var sigText = sigBtn[humanReadableIndex];
				$("#sig-url").text(sigText);
				var whatText = whatBtn[humanReadableIndex];
				$("#what-btn").text(whatText);
}
}