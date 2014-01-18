// local_setup.js 
// ideally, all customizations for version live in here

// This is the OWLServe setup file

function localConfigs() {

	setOutlinerPrefs ("#outliner", true, false);
	opSetFont (appPrefs.outlineFont, appPrefs.outlineFontSize, appPrefs.outlineLineHeight); 

    pageStore = new ServerBasedPageStore("/get/","/put/",function(pName) { 
        console.log("callback from saving " + pName);			    
    }, function(){});
}


