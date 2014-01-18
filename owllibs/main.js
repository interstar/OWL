
			var appConsts = {
				"productname": "OWL",
				"productnameForDisplay": "OWL",  
				"version": "0.1"
				}
			var appPrefs = {
				"outlineFont": "Arial", "outlineFontSize": 16, "outlineLineHeight": 24,
				"authorName": "", "authorEmail": ""
				};
			var whenLastKeystroke = new Date (), whenLastAutoSave = new Date ();  
			var flReadOnly = false, flRenderMode = false;
			var cmdKeyPrefix = "Ctrl+"; 
			
			var pageStore, currentPage;
			var navHistory = new NavHistory();

			
				
			function setInclude () { //used to test includes
				opSetOneAtt ("type", "include");
				opSetOneAtt ("url", "http://smallpicture.com/states.opml");
				}
			
			// Navigation et.	
			function editPage (pageName) {
			    console.log("Editing page "+pageName);
			    
			    pageStore.get(pageName, function(page) {
				    opXmlToOutline (page.body); 
				    currentPage = page;
				    $("#navPageName").val(currentPage.pageName);
				  });			    
				}

            function goButton() {
                savePageNow();
			    var pageName = $("#navPageName").val();			    
                forwardTo(pageName);			    
            }

            function forwardTo(pageName) {
                savePageNow();
                navHistory.newForward(pageName);			    
			    editPage(pageName);
            }

            function backButton() {
                savePageNow();
                var pageName = navHistory.back();
                editPage(pageName);
            }

		    function forwardButton() {
		        savePageNow();
		        var pageName = navHistory.forward();
		        editPage(pageName);
		    }
		    
		    
		    // Original Concord code
			function nukeDom () {
				var summit, htmltext = "", indentlevel = 0;
				$(defaultUtilsOutliner).concord ().op.visitToSummit (function (headline) {
					summit = headline;
					return (true);
					});
				var visitSub = function (sub) {
					if (sub.attributes.getOne ("isComment") != "true") { 
						htmltext += filledString ("\t", indentlevel) + sub.getLineText () + "\r\n"
						if (sub.countSubs () > 0) {
							indentlevel++;
							sub.visitLevel (visitSub); 
							indentlevel--;
							}
						}
					};
				summit.visitLevel (visitSub);
				
				var t = new Object ();
				t.text = summit.getLineText ();
				htmltext = multipleReplaceAll (htmltext, t, false, "<" + "%", "%" + ">");
				
				document.open ();
				document.write (htmltext);
				document.close ();
				}
			function opExpandCallback (parent) {
				var type = parent.attributes.getOne ("type"), url = parent.attributes.getOne ("url"), xmlUrl = parent.attributes.getOne ("xmlUrl");
				//link nodes
					if ((type == "link") && (url != undefined)) {
						window.open (url);
						return;
						}
				//rss nodes
					if ((type == "rss") && (xmlUrl != undefined)) {
						window.open (xmlUrl);
						return;
						}
				//include nodes
					if ((type == "include") && (url != undefined)) {
						op.deleteSubs ();
						op.clearChanged ();
						readText (url, function (opmltext, op) {
							op.insertXml (opmltext, right); 
							op.clearChanged ();
							}, op, true);
						}
				}
			function opInsertCallback (headline) { 
				headline.attributes.setOne ("created", new Date ().toUTCString ());
				}
			function opCollapseCallback (parent) {
				if (parent.attributes.getOne ("type") == "include") {
					parent.deleteSubs ();
					parent.clearChanged ();
					}
				}
			function opHoverCallback (headline) { 
				var atts = headline.attributes.getAll (), s = "";
				//set cursor to pointer if there's a url attribute -- 3/24/13  by DW
					if ((atts.url != undefined) || (atts.xmlUrl != undefined)) {
						document.body.style.cursor = "pointer";
						}
					else {
						document.body.style.cursor = "default";
						}
				}
				
			function opCursorMovedCallback (headline) {			}
			
			function opKeystrokeCallback (event) { 
				whenLastKeystroke = new Date (); 
			}
				
			function runSelection () {
				var value = eval (opGetLineText ());
				opDeleteSubs ();
				opInsert (value, "right");
				opGo ("left", 1);
				}
				
			function setOutlinerPrefs (id, flRenderMode, flReadonly) { 
				$(id).concord ({
					"prefs": {
						"outlineFont": appPrefs.outlineFont, 
						"outlineFontSize": appPrefs.outlineFontSize, 
						"outlineLineHeight": appPrefs.outlineLineHeight,
						"renderMode": flRenderMode,
						"readonly": flReadonly,
						"typeIcons": appTypeIcons,
						
						"hasspeciallinkhandler":true,
						"speciallinkhandler":function(url) {
						        if (url[0]=="#") {
        						    pageName = url.split("#")[1];
	        					    console.log("Going to open " + pageName);
						            forwardTo(pageName);
						        } else {
						            window.open(url);
						        }
						    }						
						},
					"callbacks": {
						"opInsert": opInsertCallback,
						"opCursorMoved": opCursorMovedCallback,
						"opExpand": opExpandCallback,
						"opHover": opHoverCallback, 
						"opKeystroke": opKeystrokeCallback
						}
					});
				}

            // My functions           

            function makeLink() {
                var concordOp = $(defaultUtilsOutliner).concord().op;
                var s = window.getSelection();
                console.log(s);
                concordOp.link("#"+s);
            }
				
			function savePageNow () {
			    currentPage.body = opOutlineToXml (appPrefs.authorName, appPrefs.authorEmail);
			    
			    currentPage.text = ($(defaultUtilsOutliner).concord ().op.outlineToText());
			     
				pageStore.save(currentPage,function(x) { console.log("ERROR " + x); }); 
				
				opClearChanged();
				console.log ("savePageNow: " + currentPage.body.length + " chars.");
				}
				
				

            function opDeleteNode() {				
                var concordOp = $(defaultUtilsOutliner).concord().op;
                if(!concordOp.inTextMode()) {
                    concordOp.deleteLine();
                }
            }
				
			function backgroundProcess () {
				if (opHasChanged ()) {
					if (secondsSince (whenLastKeystroke) >= 1) { 
						savePageNow ();
						}
					}
				}
				

