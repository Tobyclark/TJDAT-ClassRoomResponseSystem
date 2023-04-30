document.addEventListener("DOMContentLoaded", ()=> {

    const classes = document.querySelector("#classes")
    const stats = document.querySelector("#stats")
    const joinButton = document.querySelector("#linkJoinClass")
    const createButton = document.querySelector("#linkCreateClass")
    const createClass = document.querySelector("#createClass")
    const joinclass = document.querySelector("#joinclass")

    document.querySelector("#linkClasses").addEventListener("click", e => {
        e.preventDefault();
        classes.classList.remove("content__hidden");
        stats.classList.add("content__hidden");
        joinclass.classList.add("content__hidden");
        if(role === "false")
        {
            joinButton.classList.remove("content__hidden")
            createButton.classList.add("content__hidden")
        }
        else
        {
            createButton.classList.remove("content__hidden")
            joinButton.classList.add("content__hidden")
        }

    })

    document.querySelector("#linkJoinClassButton").addEventListener("click", e => {
        e.preventDefault();
        classes.classList.add("content__hidden");
        createButton.classList.add("content__hidden")
        joinButton.classList.add("content__hidden")
        joinclass.classList.remove("content__hidden")
    })

    document.querySelector("#linkStats").addEventListener("click", e => {
        e.preventDefault();
        classes.classList.add("content__hidden");
        stats.classList.remove("content__hidden");
        joinclass.classList.add("content__hidden");
    })

    document.querySelector("#linkCreateClassButton").addEventListener("click", e => {
        e.preventDefault();
        classes.classList.add("content__hidden");
        createClass.classList.remove("content__hidden")
        createButton.classList.add("content__hidden")
        joinclass.classList.add("content__hidden");
    })
});