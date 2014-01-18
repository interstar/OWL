// local_setup.js 
// ideally, all customizations for version live in here

// This is the single-page localStorage version


function localConfigs() {
	setOutlinerPrefs ("#outliner", true, false);
	opSetFont (appPrefs.outlineFont, appPrefs.outlineFontSize, appPrefs.outlineLineHeight); 	
    pageStore = new BrowserBasedPageStore();
}


