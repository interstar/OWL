

class @Page
    constructor:(@pageName,@body) ->
        @created = new Date().toString()
        @saved = ""
    
    toString:() ->
        return "#{@pageName} \n #{@body} \n #{@created} \n #{@saved} "
        
        
class @PageStore
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
        
        
