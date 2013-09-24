"""
Now using Aaron Swartz's web.py
"""

import web

urls = (
            '/'          , 'Index',
            '/put/(.*)'  , 'Save'
)



class Index ():
    
    def GET(self):
        print "OWL Service is running"
        web.internalerror = web.debugerror


class Save :

    def POST(self,pName):
        try :
            form = web.input()
            pageName = form.pageName
            body = form.body
            f = open("./static/%s.opml"%pageName,"w")
            f.write(body)
            f.close()
            print "OK"
            
        except Exception, e :
            print "%s" % e        
        #web.redirect(web.ctx.home+'/static/'+pName) 

           
if __name__ == '__main__':
    web.run(urls, web.reloader)
