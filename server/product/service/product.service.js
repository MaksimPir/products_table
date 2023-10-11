const fs=require('fs')
const ApiError=require('../../exceptions/api-error')
class ProductService{
    getAllProducts()
    {
        const jsonData = fs.readFileSync('data/data.json')
        return JSON.parse(jsonData)  
    }
    getProductById(id)
    {
        const jsonData = fs.readFileSync('data/data.json')
        const data=JSON.parse(jsonData)  
        const findEl=data.find(el=>el.id===id)
        if(!findEl)
        {
            throw ApiError.BadRequestError('Такого товара не существует')
        }
        return findEl  
    }
    createProduct(name, isStock, dateOrder, customer, weight)
    {
        const existProducts=this.getAllProducts()
        const maxId=existProducts.reduce((id, current)=>{
            if(current.id>id) 
            {
                id=current.id
            }
            return id
        },0)
        const newProduct={
            id: maxId+1,
            name: name,
            weight: weight,
            dateOrder:new Date(dateOrder),
            isStock: isStock,
            customer:customer
        }
        existProducts.push(newProduct)
        this.saveProductData(existProducts)
    }
    deleteProduct(id)
    {
        const existProducts=this.getAllProducts()
        const newProducts=existProducts.filter(el=>el.id!==id)
        this.saveProductData(newProducts)
    }
    updateProduct(id, isStock, customer)
    {
        const existProducts=this.getAllProducts()
        const productToUpdate=existProducts.find(el=>el.id===id)
        if(!productToUpdate)
        {
            throw ApiError.BadRequestError('Такого товара не существует')
        }
        const updateProducts=existProducts.filter(el=>el.id!==id)
        updateProducts.push({...productToUpdate, isStock,customer})
        this.saveProductData(updateProducts)
    }
    saveProductData(data)
    {
        const stringifyData = JSON.stringify(data)
        fs.writeFileSync('data/data.json', stringifyData)
    }
}
module.exports = new ProductService()