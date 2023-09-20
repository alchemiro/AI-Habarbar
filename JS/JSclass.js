class user{
    #id = 0
    #pass = ""
    constructor(ID, Password)
    {
        this.#id = ID
        this.#pass = Password
    }
}

class guest extends user{
    constructor(ID, password, first_name, last_name){
        super(ID, password)
        this.#first_name = first_name
        this.#last_name = last_name
        this.#likes = []
    }
}

class student extends guest{
    constructor(ID, password, projectID, first_name, last_name){
        super(ID, password, first_name, last_name)
        this.#projectID = projectID
    }

    function getLikes(){
        return this.likes
    }


}


function main(){
    const clown = new student("6846","1234",1,"seymour","butts")
    console.log(clown.getLikes())
}
main()
