

class @Page
    constructor:(@pageName,@body) ->    
        @created = new Date().toString()
        @saved = ""
        @text = ""
    
    toString:() ->
        return "#{@pageName} \n #{@body} \n #{@created} \n #{@saved} "
        
        
class @BrowserBasedPageStore
    k:(pName) -> "fpt.pageStore."+pName

    x:(pName) -> "fpt.ps.X."+pName
    
    isDirty:(pName) ->        
        s = localStorage.getItem(x(pName))
        return (s == "true")
        
    setDirty:(pName) ->
        localStorage.setItem(x(pName),"true")
    
    setClean:(pName) ->
        localStorage.setItem(x(pName),"false")

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
        
    set:(pName,page) -> 
        localStorage.setItem(@k(pName),JSON.stringify(page))
        # tell that we've changed this item in browser store
        @setDirty(pName)
    
    save:(page,errorCallback) -> 
        page.saved = new Date().toString()
        @set(page.pageName,page)
        

class SyncQueue
    constructor:(@pageStore,@postUrl,@postSuccessHandler,@errorHandler) ->
        @queue = []
        
    add:(pageName) ->
        if pageName in @queue 
            return
        @queue.push(pageName)
        console.log(@queue)
        
    isHolding:(pageName) -> pageName in @queue
        
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
                    data : {"pageName":pName, "body":page.body, "text":page.text},
                    success : (data) =>
                        @pageStore.setClean(pName)
                        @postSuccessHandler(pName)
                    ,
                    error   : (xmlHttpRequest) =>
                            console.log("ERROR IN POST " + pName)
                            console.log(xmlHttpRequest)
                            @add(pName)
                })
                
            )

class @ServerBasedPageStore
    constructor:(@getUrl,@postUrl,postSuccessHandler,saveErrorHandler) ->
        @inner = new BrowserBasedPageStore()
        @syncQueue = new SyncQueue(this,@postUrl,postSuccessHandler,saveErrorHandler)
        @syncTimer = setInterval( () => 
            console.log("in synctimer")
            console.log("this is " + this)
            @next()
        ,10000)

    get:(pName,callback) ->
        if @inner.isDirty(pName)
            @inner.get(pName,callback)
            return
                        
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
        

    setClean:(pName) -> @inner.setClean(pName)
       
    save:(page) -> 
        @inner.save(page)
        console.log("Now adding #{page.pageName} to queue")
        @syncQueue.add(page.pageName)

    # this is regularly called on a timer
    next:() ->
        @syncQueue.next(@inner)



