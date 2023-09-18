import sys

class user:
    def __init__(self, ID, password):
        self.ID = ID
        self.password = password
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
        self.likes = []
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
        self.Pid = ProjectID
        self.cat = category
    

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
    

if(__name__ == "__main__"):
    main()
