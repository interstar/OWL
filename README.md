OWL : Outliner with Wiki Linking
================================

I love outlining. I love wiki. What do you get when you create a mutant cross-breed of the two?

A *fucking power tool*, that's what.

What?
-----

This is a quick proof of concept based on the [Concord outliner](https://github.com/scripting/concord). 

It combines the goodness of outlining from Concord with some compelling ideas of wiki (channeled through my [SdiDesk](http://thoughtstorms.info/view/sdidesk) experience).

Initial features of this demo :
* unlike the original Concord "Hello" example, you can create a number of _named_ outlines (or "pages" in Wiki terminology).
* a navbar where you can type the name of any outline and click the Go! button to go there. Also has forward and back buttons.
* easy link-making. I've gone for a slightly different approach here that I hope speaks to both outliner and wiki tropes. To turn 
any piece of text into a link, select it, and click the "Link" button on the navbar. What this will do is make that text into a 
link to an outline of the _same name_. It's wiki's [concrete names](http://thoughtstorms.info/view/concretepagenames) policy in 
action. (I know! I know! You think this is the dumbest idea you've ever heard. You want to be able to have a distinction between 
the "real name" and the "display name". But trust me :-) )
* a very primitive server that lets you save outlines to the local file-system.


Quick Start #1
--------------

To see OWL in action in the browser, as quickly as possible, just do this.

    git clone https://github.com/interstar/OWL.git owl
    cd owl
    firefox index.html
    
You should now have a copy of OWL running in your browser.

Alternatively, [try it out here.](http://project.thoughtstorms.info/owl/index.html)

WARNING : As with the other Concord examples, your outlines are stored locally in the browser. Don't put too much work into this, it's 
a demonstration.

Quick Start #2 : Basic Server
-----------------------------
There's now a very very basic Python server for OWL. This is intended to run on your own local machine, and allows OPML files to be saved 
into the local file system.

You'll need to have Python installed on your local machine. The server uses [web.py](http://webpy.org/), a copy of which is included.

You'll need to run a short make script to set up some symbolic links on your machine.

    git clone https://github.com/interstar/OWL.git owl
    cd owl
    ./make.sh 
    python OWLServe.py
    
    firefox localhost:8080/static/server.html


Your OPML pages will be stored in the static subdirectory of the main owl directory.

WARNING : This version of OWL is backing-up pages to the local server. Sometimes if you edit or move around too fast, changes can get lost. 

Drive slowly! And don't forget to report any bugs :-)

Other Issues
------------

To create a page / outline that doesn't exist yet, just make and follow a link to it, or type the name into the navbar and click Go.

Some of the additional code is written in CoffeeScript which is compiled to Javascript. I've included the compiled javascript files in git so you can install and run the code without having CoffeeScript installed. But you'll need CoffeeScript if you want to edit and recompile these files.

Forked Concord
--------------
I was really trying hard to avoid forking the Concord library for this.

But I couldn't make it work without patching a small change into concord.js , basically to allow me to write my own handler for 
when the user clicks on links.

The patch is recorded in the file called concord.js.diff and is this : 

    @@ -1156,7 +1156,12 @@ function ConcordEvents(root, editor, op, concordInstance) {
     		if(target.is("a")){
     			if(target.attr("href")){
     				event.preventDefault();
    -				window.open(target.attr("href"));
    +				if (concordInstance.prefs()["hasspeciallinkhandler"]==true) {
    +                    lh = concordInstance.prefs()["speciallinkhandler"];
    +                    lh(target.attr("href"));
    +			    } else {
    +				    window.open(target.attr("href"));
    +				    }
     				}
     			return;
     			}

I'd like to find a way to avoid having to do this. When I do, I'll revert to using the default Concord as a submodule. 


Credits
-------
* [Dave Winer](http://scripting.com/) for getting a decent outliner into the browser (at last) and having the generosity to open-source the core.
* [Ward Cunningham](https://github.com/WardCunningham/) for wiki fact and philosophy.
* [Aaron Swartz](http://www.rememberaaronsw.com/), author of the web.py module that runs the basic server included here, who died fighting for the principle that knowledge should be a free and open resource for all.

