

class @Page
    constructor:(@pageName,@body) ->
        @created = new Date().toString()
        @saved = ""
    
    toString:() ->
        return "#{@pageName} \n #{@body} \n #{@created} \n #{@saved} "
        
        
class @BrowserBasedPageStore
    k:(pName) -> "fpt.pageStore."+pName

    hasName:(pName) ->
        s = localStorage.getItem(@k(pName))        
        if s?
            return true
        return false
        
    get:(pName,callback) -> 
        s = localStorage.getItem(@k(pName))        
        if s?
            page = JSON.parse(s)
        else 
            page = new Page(pName,initialOpmltext)
        callback(page)
        
    set:(pName,page) -> localStorage.setItem(@k(pName),JSON.stringify(page))
    
    save:(page,errorCallback) -> 
        page.saved = new Date().toString()
        @set(page.pageName,page)
        

class SyncQueue
    constructor:(@postUrl,@errorHandler) ->
        @queue = []
        
    add:(pageName) ->
        if pageName in @queue 
            return
        @queue.push(pageName)
        console.log(@queue)
        
    next:(pageStore) ->
        console.log("in queue next ... url is #{@postUrl}")
        while @queue.length > 0
            pName = @queue.pop()
            pageStore.get(pName,(page) =>
                console.log("POSTING " + pName)
                console.log(@postUrl+pName)
                
                $.ajax({
                    type : 'POST',
                    url : @postUrl+pName,
                    data : {"pageName":pName, "body":page.body},
                    success : (data) ->
                    ,
                    error   : (xmlHttpRequest) ->
                            console.log("ERROR IN POST " + pName)
                            console.log(xmlHttpRequest)     
                })
                
            )

class @ServerBasedPageStore
    constructor:(@getUrl,@postUrl,saveErrorHandler) ->
        @inner = new BrowserBasedPageStore()
        @syncQueue = new SyncQueue(@postUrl,saveErrorHandler)

    get:(pName,callback) ->         

        $.ajax({ 
            type: 'GET', 
            url: @getUrl+pName+".opml",
            success: (data) ->
                console.log(data)
                callback(new Page(pName,data))
            ,    
            error: (xmlHttpRequest) =>
                console.log("ERROR IN get " + pName)                
                @inner.get(pName,callback)
        });        
        
       

    save:(page) -> 
        @inner.save(page)
        console.log("Now adding #{page.pageName} to queue")
        @syncQueue.add(page.pageName)
        @syncQueue.next(@inner)


