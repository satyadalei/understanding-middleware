const express = require("express");
const app = express();


app.use(middleware1);
app.use(middleware2);
app.use(middleware3);


function middleware1(request, response, next){
    console.log("this is middleware 1 -- global middleware");
    request.noOfShirts = 100 ;
    request.name = "Satyanarayan Dalei";
    next()
}
function middleware2 (request,response, movenext){
    console.log("This is middleware no 2 -- global middleware");
    console.log(request.noOfShirts);
    request.name = "Satyajit Dalei"
    movenext();
}
function middleware3 (request,response, movenext){
    console.log("This is middleware no 3 -- global middleware");
    request.name = "Puspanjali Dalei"
    movenext();
}
function standardfunction(request, response, nextmiddleware){
    console.log("This is another middleware - route specific middleware");
    response.send("<h1>Hello Everyone</h1>");
    console.log(request.name);

}

function errorHandler(error,req,res,movenext){
     if(error){
        res.send("<h1>Opps there is an error</h1>");
     }
}

app.get("/", standardfunction);









app.use(errorHandler);
app.listen(4000, function(){
    console.log("Server started in 4000 port");
})