

class @Page
    constructor:(@pageName,@body) ->
        @created = new Date().toString()
        @saved = ""
    
    toString:() ->
        return "#{@pageName} \n #{@body} \n #{@created} \n #{@saved} "
        
        
class @BrowserBasedPageStore
    k:(pName) -> "fpt.pageStore."+pName
    
    get:(pName) -> 
        s = localStorage.getItem(@k(pName))
        if s?
            return JSON.parse(s)
        return new Page(pName,initialOpmltext)
    set:(pName,page) -> localStorage.setItem(@k(pName),JSON.stringify(page))
    
    save:(page) -> 
        page.saved = new Date().toString()
        @set(page.pageName,page)
        

class @ServerBasedPageStore
    constructor:(@getUrl,@postUrl) ->

    get:(pName,callback) -> 
        s = ""
        $.get(@getUrl+"pName", (data) ->
            console.log(data)
            if s?                
                callback(JSON.parse(s))
                return
            else
                callback(new Page(pName,initialOpmltext))
        )
        
       
    set:(pName,page) -> 
        $.post(@postUrl,{"pageName":pName, "page":JSON.stringify(page)}, (data) ->
            # TODO : HANDLE IF THERE ARE PROBLEMS
        )

    save:(page) -> 
        page.saved = new Date().toString()
        @set(page.pageName,page)
        
