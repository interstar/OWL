"""
Based on Aaron Swartz's web.py (http://www.aaronsw.com/)
"""


import web

urls = (
            '/'             , 'Index',
            '/get/(.*)'     , 'Get',
            '/put/(.*)'     , 'Save'
)

pagedir = './static/pages/'

def fName(pName) : return "%s%s.opml"%(pagedir,pName)

# System Services
def isSystemService(s) : return s[0:2] == "!!"

class SystemServices(dict) :
   
    @classmethod
    def call(cls, full_name) :
        name = full_name[2:]
        try :
            handler = getattr(cls,name)
        except Exception, e :
            return cls.standardErrorPage(name)
        return handler()

    @classmethod 
    def getTpl(cls) : return open("./static/SystemServiceTpl.opml").read()
        
    @classmethod
    def ol(cls,s,inner="") : return """<outline text="%s">%s</outline>""" % (s,inner)

    @classmethod
    def ols(cls,title,items) : return cls.ol(title,"\n".join(items) ) 

    @classmethod
    def wrap(cls,p) :
        return cls.ol("&lt;a href='#%s'&gt;%s&lt;/a&gt;"% (p,p))


    @classmethod
    def services(cls) :
        services = ["!!HelloSystem","!!Status","!!AllPages"]
        return cls.ols("Services Here", ((cls.wrap(x) for x in services) ) )
        
    @classmethod
    def HelloSystem(cls) :
        return cls.getTpl() % ("Hello System",cls.ol("This is a reply from the HelloSystem System Service"))


    @classmethod
    def Status(cls) :
        import time
        xs = [
            "I'm the Python-based OWL Service, and I seem to be working",
            "Time and Date : %s" % time.strftime("%c"),
            "For OWL news follow &lt;a href='http://sdi.thoughtstorms.info/?cat=17'&gt;the SmartDisorganized blog&lt;/a&gt;"
        ]
        
        
        return cls.getTpl() % ("Status",("\n".join(cls.ol(x) for x in xs)) + cls.services())

    
    @classmethod
    def AllPages(cls) :
        import os

        pages = sorted([x.strip(".opml") for x in os.listdir("./static/pages/") if ".opml" in x])
        d = {}
        for p in pages :
            if len(p) < 1 : continue
            init = p[0]
            if not d.has_key(init) :
                d[init] = []
            d[init].append(p)

        build = ""
        for k in sorted(d.iterkeys()) :
            ps = d[k]
            build = build + """<outline text="%s">%s</outline>""" % (k, "".join(cls.wrap(p) for p in ps))
        
        return cls.getTpl() % ("AllPages",build)
    
    @classmethod        
    def standardErrorPage(cls,name) :
        err = (open("./static/SystemServiceError.opml")).read() % name        
        return err
        


# Server
class Index ():
    
    def GET(self):        
        web.redirect(web.ctx.home+'/static/index.html') 

class Get :
    def GET(self,pName) :
        if isSystemService(pName) : 
            print SystemServices.call(pName)
            return  
        try :
            f = open(fName(pName))
            print f.read()
        except Exception, e :
            if "No such file or directory:" in "%s"%e :
                print "<xml><message>MISSING FILE</message></xml>"
            else :
                print "%s" % e

class Save :

    def POST(self,pName):
        if isSystemService(pName) : return # don't try to save a SystemService page
        try :
            form = web.input()
            pageName = form.pageName
            body = form.body
            f = open(fName(pName),"w")
            f.write(body)
            f.close()
            if form.text :
                f = open("./exports/text/%s.txt"%pageName,"w")
                f.write(form.text)
                f.close()
            print "OK"
            
        except Exception, e :
            print "%s" % e        
        


if __name__ == '__main__':
    web.run(urls, web.reloader)

