"""
Based on Aaron Swartz's web.py (http://www.aaronsw.com/)
"""


import web

urls = (
            '/'          , 'Index',
            '/put/(.*)'  , 'Save'
)

pagedir = '/static/pages/'


class Index ():
    
    def GET(self):        
        web.redirect(web.ctx.home+'/static/server.html') 
        #web.internalerror = web.debugerror


class Save :

    def POST(self,pName):
        try :
            form = web.input()
            pageName = form.pageName
            body = form.body
            f = open(".%s%s.opml"%(pagedir,pageName),"w")
            f.write(body)
            f.close()
            if form.text :
                f = open("./exports/text/%s.txt"%pageName,"w")
                f.write(form.text)
                f.close()
            print "OK"
            
        except Exception, e :
            print "%s" % e        
        #web.redirect(web.ctx.home+'/static/'+pName) 


if __name__ == '__main__':
    web.run(urls, web.reloader)

