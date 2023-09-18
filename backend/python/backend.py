import sys
from PIL import Image
class user:
    def __init__(self, ID, password):
        self.__ID = ID
        self.__password = password
    def GetID(self):
        return self.ID
    def SetID(self, Id):
        self.ID = Id
    def GetPass(self):
        return self.password
    def SetPass(self, Pass):
        self.password = Pass
        
class admin(user):
    pass

class guest(user):
    def __init__(self, ID, password):
        super().__init__(ID, password)
        self.__likes = []
    def AddLike(self, Pid):
        if len(self.likes) < 20:
            self.likes.append(Pid)
    def RMlike(self, Pid):
        self.likes.remove(Pid)
    def ClearLikes(self):
        self.likes = []
    def GetLikes(self):
        return self.likes
        
class student(guest):
    def __init__(self, ID, password, ProjectID, category):
        super().__init__(ID, password)
        self.__Pid = ProjectID
        self.__cat = category
    def GetProject(self):
        return self.Pid
    def SetProject(self, ProjectID):
        self.Pid = ProjectID
    def GetCategory(self):
        return self.cat
    def SetCategory(self, category):
        self.cat = category
    


class project():
    def __init__(self, ID, name):
        self.__ID = ID
        self.__name = name
        self.__Grades = [None] * 5 # here we put the amout of judges
        self.__image = Image.open("your_image.jpg")  # Replace "your_image.jpg" with your image file path
        self.__likes = 0
        self.summery = ""
    def ShowPhoto(self):
        self.image.show()
        
        
    

def main():
    print("fwell done")
    u = user("1", "8")
    g = guest("3", 7)
    g.AddLike("1234")
    print(g.GetID())
    print(u.GetID())
    l = g.GetLikes()
    for i in l:
        print(i)
    s = student("11", "12", "13", "14")
    s.AddLike("45")
    s.likes
    

if(__name__ == "__main__"):
    main()
