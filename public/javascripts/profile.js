document.querySelector("#profile-image").addEventListener("click", function(){
    document.querySelector("#profile-file").click()
})

document.querySelector("#profile-file").addEventListener("change",function(){
    document.querySelector("form").submit();
})