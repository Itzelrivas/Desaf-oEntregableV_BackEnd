import express from 'express';
const router = express.Router();
import fs from 'fs';

const direcName = "././archivos"
const fileName = direcName + "/productos.json"

let products = fs.readFileSync(fileName, "utf-8")
products = JSON.parse(products)

//Ruta que muestra los productos no en tiempo real
router.get("/home", (request, response) => {
    response.render('home', {
        style: "viewsHandlebars.css",
        products
    })
})

//Ruta que muestra los productos en tiempo real
router.get("/realtimeproducts", (request, response) => {
    response.render('realTimeProducts', {
        style: "viewsHandlebars.css",
        products
    })
})

//Ruta que nos muestra el chat
router.get("/messages", (request, response) => {
    response.render('chat', {
        style: "viewsHandlebars.css"
    })
})

export default router;