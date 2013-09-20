
class @NavHistory
    constructor:() ->
        @past = []
        @future = []
    
    newForward:(currentPageName) -> 
        @past.push(currentPageName)
        @future = []
     
    back:() ->        
        if @past.length == 1
            return @past[0]
        currentName = @past.pop()
        @future.push(currentName)
              
        return @past[@past.length-1]
    
    forward:() ->
        if @future.length == 0
            return @past[@past.length-1]
        pageName = @future.pop()
        @past.push(pageName)
        return pageName
        
    
    
        
