const productService=require('../service/product.service')
class ProductController
{
    getAllProducts(req,res,next)
    {
        try
        {
            const productsData=productService.getAllProducts()
            res.status(201).json(productsData)
        }
        catch(e)
        {
            next(e)
        }
    }
    getProductById(req,res,next)
    {
        try {
            const idProduct=Number(req.params.id)
            const productData=productService.getProductById(idProduct)
            res.status(201).json(productData)
        } catch (e) {
            next(e)
        }
    }
    updateProduct(req,res,next)
    {
        try {
            const {id, isStock, customer}=req.body
            productService.updateProduct(id,isStock,customer)
            res.status(200).json('Продукт успешно отредактирован')
        } catch (e) {
            next(e)
        }
    }
    deleteProduct(req,res,next)
    {
        try {
            const idProduct=Number(req.params.id)
            productService.deleteProduct(idProduct)
            res.status(200).json('Продукт успешно удален')
        } catch (e) {
            next(e)
        }
    }
    createProduct(req,res,next)
    {
        try {
            console.log(req.body);
            const {name,customer, isStock, dateOrder, weight}=req.body
            productService.createProduct(name,isStock,dateOrder,customer,weight)
            res.status(201).json('Продукт успешно создан')
        } catch (e) {
            next(e)
        }
    }
}
module.exports=new ProductController()