const Router=require('express')
const router=new Router()
const productController=require('../product/controller/product.controller')
router.delete('/products/:id', productController.deleteProduct)
router.patch('/products',productController.updateProduct)
router.post('/products',productController.createProduct)
router.get('/products/:id',productController.getProductById)
router.get('/products',productController.getAllProducts)


module.exports=router