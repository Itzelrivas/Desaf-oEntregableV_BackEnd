import { Router } from 'express';
import fs from 'fs';

import { cartsModel } from '../dao/models/carts.model.js'


const router = Router();
const direcName = "././archivos"
const fileName = direcName + "/carrito.json"
const fileNameProducts = direcName + "/productos.json"

//Dejamos funcionando este crack. Funciona con moongose :)
router.post('/', async (request, response) => {
    try {
        let idCart
        do {
            idCart = Math.floor(Math.random() * 10000);
            const existingCart = await cartsModel.findOne({ id: idCart });
            if (!existingCart) {
                break;
            }
        } while (true);

        const cart = {
            id: idCart,
            products: []
        };
        await cartsModel.create(cart)

        if (fs.existsSync(fileName)) {
            let carts = fs.readFileSync(fileName, "utf-8")
            if (!carts) {
                carts = [];
            } else {
                carts = JSON.parse(carts);
            }

            carts.push(cart)
            fs.writeFileSync(fileName, JSON.stringify(carts, null, 2));
            return response.send(`Se ha creado un nuevo carrito con id=${idCart}`)
        }
    } catch (error) {
        console.error("Ha surgido este error: " + error)
        response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error, por lo tanto, no se pudo crear un carrito.</h2>')
    }
})

//Params 
router.get('/:cid', (request, response) => {
    try {
        if (fs.existsSync(fileName)) {
            let carts = fs.readFileSync(fileName, "utf-8")
            carts = JSON.parse(carts);
            let cartId = request.params.cid

            if (carts && carts.length > 0) {
                const idSearch = carts.find(cart => cart.id === parseInt(cartId))
                if (idSearch) {
                    return response.send(idSearch.products)
                }
                return response.send({ msg: `El carrito con el id=${cartId} no existe.` })
            }
            else {
                return response.send('<h2 style="color: red">No hay carritos disponibles, por lo tanto, no podemos ejecutar esto.</h2>');
            }
        }
    } catch (error) {
        console.error("Ha surgido este error: " + error)
        response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error, por lo tanto, no se pudo buscar el carrito.</h2>')
    }
})

//2 params para agregar a un carrito específico, un producto específico. Funciona con moongose :)
router.post('/:cid/product/:pid', async (request, response) => {
    try {
        if (fs.existsSync(fileName)) {
            let carts = fs.readFileSync(fileName, "utf-8")
            carts = JSON.parse(carts);
            let cartId = request.params.cid
            let productId = request.params.pid

            if (carts && carts.length > 0) {

                let idSearch = carts.find(cart => cart.id === parseInt(cartId))
                if (idSearch) {
                    let productsCart = idSearch.products //Productos del carrito
                    if (fs.existsSync(fileNameProducts)) {
                        let products = fs.readFileSync(fileNameProducts, "utf-8")
                        products = JSON.parse(products)
                        const productsId = products.map(product => product.id)
                        if (productsId.includes(parseInt(productId))) {
                            let productsIdCart = productsCart.map(prod => prod.product) //Guarda los id´s de los productos de mi carrito y genera la proipiedad .product dentro del array products

                            if (productsIdCart.includes(parseInt(productId))) {
                                const productPosition = productsCart.findIndex(prod => prod.product === parseInt(productId))
                                productsCart[productPosition].quantity++;

                                await cartsModel.updateOne(
                                    { id: cartId, "products.product": productId },
                                    { $inc: { "products.$.quantity": 1 } }
                                );
                            }
                            else {
                                const updateCart = {
                                    product: parseInt(productId),
                                    quantity: 1
                                }
                                productsCart.push(updateCart)

                                await cartsModel.updateOne(
                                    { id: parseInt(cartId) },
                                    { $push: { products: updateCart } }
                                );
                            }
                            fs.writeFileSync(fileName, JSON.stringify(carts, null, 2));
                            return response.send(`Se ha agregado el producto con el id=${productId} al carrito con id=${cartId}`)
                        }
                        else {
                            return response.send(`Oh Oh, no puedes agregar el producto con el id=${productId} porque no existe :(`)
                        }
                    }
                }
                return response.send({ msg: `El carrito con el id=${cartId} no existe.` })
            }
            else {
                return response.send('<h2 style="color: red">No hay carritos disponibles, por lo tanto, no podemos ejecutar esto.</h2>');
            }
        }
    } catch (error) {
        console.error("Ha surgido este error: " + error)
        response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error, por lo tanto, no se pudo agregar un producto al carrito.</h2>')
    }
})

export default router;