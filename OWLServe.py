"""
Now using Aaron Swartz's web.py
"""

import web

from OWLPageStore import *

urls = (
            '/'          , 'Index',
            '/view/(.*)' , 'View',
            '/put/(.*)'  , 'Save'
)



class Index ():
    
    def GET(self):
        print "OWL Service is running"
        web.internalerror = web.debugerror


class View ():
    
    def __init__(self) :
        self.store = FileSystemPageStore()
        self.store.setDirectory('.')
        for x in range (65,91) :
            self.store.ensureDirectory('./pages/%c/' % x)
        
    def GET(self,pName):
        if pName != '' :
            p = self.store.loadRaw(pName)
        else :
            p = Page()
        print self.wrap(pName,p.raw,'save',pName)
        web.internalerror = web.debugerror

    def pageBody(self, pName, bod) :
        return self.mp.getCooked(bod)
        



class Save :

    def __init__(self) :
        self.store = FileSystemPageStore()
        self.store.setDirectory('.')

    def POST(self,pName):
        form = web.input()
        p = Page(form.pagename, form.raw)
        self.store.savePage(p, p.pageName)
        web.redirect(web.ctx.home+'/view/'+pName) 

           
if __name__ == '__main__':
    web.run(urls, web.reloader)

