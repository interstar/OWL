
from os import chdir, makedirs

class Page :

    def __init__(self, pageName='') :
        self.pageName = pageName
        self.body = None

    def isNew(self) :
        return False
        

class WADSException(Exception) :
    def __init__(self, s) : self.s = s        
    def __str__(self) : return self.s
      

class FileSystemPageStore :

    def __init__(self,directory) :
        self.directory = directory
        ensureDirectory(directory)
        chdir(directory)

    def ensureDirectory(self, path) :
        try :
            makedirs(path)
        except :
            pass
        
    def pageExists(self, pageName) :
        try :
            f = open('%s/%s.opml' % (self.directory, pageName), 'r')
            f.close()
            return True
        except :
            return False

    def load(self, fileName) :
        f = open(fileName, 'r')
        s = f.read()
        f.close()
        return s

    def savePage(self, pageName, body) :
        path = "%s.opml" % pageName            
        f = open(path, 'w')            
        f.write("%s" % body)
        f.close()

