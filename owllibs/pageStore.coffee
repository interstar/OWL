

class @Page
    constructor:(@pageName,@body) ->    
        @created = new Date().toString()
        @saved = ""
        @text = ""
    
    toString:() ->
        return "#{@pageName} \n #{@body} \n #{@created} \n #{@saved} "


isSystemService = (name) -> name.search("!!") > -1        


class @DummyPageStore
    hasName:(pName) -> false
    
    hasSystemService:(pName) -> false
    
    get:(pName,callback) ->
        callback(new Page(pName,initialOpmltext))
        
    save:(page,errorCallback) ->
        

        
        
class @BrowserBasedPageStore
    k:(pName) -> "fpt.pageStore."+pName

    x:(pName) -> "fpt.ps.X."+pName
    
    isDirty:(pName) ->        
        s = localStorage.getItem(@x(pName))
        return (s == "true")
        
    setDirty:(pName) ->
        localStorage.setItem(@x(pName),"true")
    
    setClean:(pName) ->
        localStorage.setItem(@x(pName),"false")

    hasName:(pName) ->
        s = localStorage.getItem(@k(pName))        
        if s?
            return true
        return false

    hasSystemService:(pName) -> false
        
    get:(pName,callback) -> 
        s = localStorage.getItem(@k(pName))        
        if s?
            page = JSON.parse(s)
        else 
            page = new Page(pName,initialOpmltext)
        callback(page)
        
    set:(pName,page) -> 
        localStorage.setItem(@k(pName),JSON.stringify(page))
        # tell that we've changed this item in browser store
        @setDirty(pName)
    
    save:(page,errorCallback) -> 
        if isSystemService(page.pageName)
            # it's a SystemService (ie. not a page to store, so we do nothing)
            return
        page.saved = new Date().toString()
        @set(page.pageName,page)
        

class @ServerBasedPageStore
    constructor:(@getUrl,@postUrl,@postSuccessHandler) ->                            
        
    get:(pName,callback) ->
        $.ajax({ 
            type: 'GET', 
            url: @getUrl+pName,
            
            success: (data) ->                
                x = $($.parseXML(data.toLowerCase())).find('message')[0]
                msg = ""               
                if x
                    msg = x["textContent"]
                
                if msg == "missing file"
                    console.log("Page #{pName} doesn't exist so creating")
                    callback(new Page(pName,initialOpmltext))
                else 
                    callback(new Page(pName,data))
            ,    
            error: (response) =>
                console.log("ERROR IN get " + pName)
                console.log(response)
                
        });        
        
       
    save:(page,saveErrorHandler) ->
        if isSystemService(page.pageName)
            # it's not a page to store, so we do nothing
            return
        $.ajax({
            type : 'POST',
            url : @postUrl+page.pageName,
            data : {"pageName":page.pageName, "body":page.body, "text":page.text},
            success : (data) =>
                @postSuccessHandler(page.pageName)
            ,
            error   : (xmlHttpRequest) =>
                    console.log("ERROR IN POST " + page.pageName)
                    console.log(xmlHttpRequest)
                    saveErrorHandler(xmlHttpRequest)
        })



class @AndroidBasedPageStore

    hasName:(pName) ->
        s = Android.readPage(pName)
        if s == "NO FILE"
            return false
        return true
        
    get:(pName,callback) -> 
        console.log("trying to read #{pName} from Android")
        s = Android.readPage(pName)
        console.log("Android read #{pName}")
        console.log(s)
        if s == "NO FILE"
            page = new Page(pName,initialOpmltext)
        else 
            page = new Page(pName,s)
        console.log(page)
        callback(page)
            
    save:(page,errorCallback) ->         
        s = Android.writePage(page.pageName,page.body)
        if s != "OK"
            errorCallback(s)            
        
