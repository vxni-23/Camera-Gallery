let db;
let openRequest = indexedDB.open("myDataBase");

openRequest.addEventListener("success", function(e){
    console.log("DB success");
    db = openRequest.result;
})
openRequest.addEventListener("error", function(e){
    console.log("DB error");
})
openRequest.addEventListener("upgradeneeded", function(e){
    console.log("DB upgraded");
    db = openRequest.result;
    db.createObjectStore("video", {keyPath : "id"});
    db.createObjectStore("image", {keyPath : "id"});
})
