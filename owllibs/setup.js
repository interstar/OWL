// setup.js

function markdownExport() {
    $.get("/md/"+currentPage.pageName, function(data) {
        console.log(data);
    });
}

function setupEvents () {

	$("#idMenuProductName").text (appConsts.productname);
	$("#idProductVersion").text ("v" + appConsts.version);

	//init menu keystrokes
	if (navigator.platform.toLowerCase ().substr (0, 3) == "mac") {
		cmdKeyPrefix = "&#8984;";
	}
	$("#idMenubar .dropdown-menu li").each (function () {
		var li = $(this);
		var liContent = li.html ();
		liContent = liContent.replace ("Cmd-", cmdKeyPrefix);
		li.html (liContent);
	});


	$("#goButton").click(function(event) { goButton(); });
	$("#backButton").click(function(event) { backButton();  });
	$("#forwardButton").click(function(event) { forwardButton();  });

	$("#makeLinkButton").click(function(event) { makeLink(); });				
	
	$("#upButton").click(function(event)   { opReorg (up, 1); });
	$("#downButton").click(function(event) { opReorg (down, 1); });
	$("#leftButton").click(function(event)   { opReorg (left, 1); });
	$("#rightButton").click(function(event)   { opReorg (right, 1); });
	
	
	$("#forceSaveButton").click(function(event) { savePageNow(); });			
	$("#markdownExportButton").click(function(event) { markdownExport(); });

}


function commonStartup() {	
    // This block to allow opening specific outline when page loads in browser
    // TODO check if working
    path = window.location.pathname + window.location.hash;
    console.log(path);
    console.l
    if (path.indexOf("#") >= 0) {
        parts = path.split("#");
        pageName = parts[parts.length-1];
    } else {
        pageName = "HelloWorld";
    }
    console.log(pageName);
    // End of specific page opening

		
	editPage (pageName);
	navHistory.newForward(pageName);
	
	self.setInterval (function () {backgroundProcess ()}, 30000); //call every 30 seconds
}

