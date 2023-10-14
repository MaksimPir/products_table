import { makeAutoObservable, runInAction } from "mobx";
import { IProduct, IProductPropsCreate, IProductPropsUpdate } from "../model";
import ProductService from "../services/ProductService";
import { openNotification } from "../lib/helpers";

class ProductStore
{
    products:IProduct[]=[]
    isLoading:boolean=false
    answer:string=''
    errors:string=''
    constructor()
    {
        makeAutoObservable(this)
    }
     fetchProducts =async()=>
    {
        this.isLoading=true
            try {
                const response=await ProductService.getAllProducts()
                runInAction(()=>{
                    this.products= response
                })
                
            } catch (e) {
                runInAction(()=>{
                    this.errors=(e as Error).message
                })
                openNotification(this.errors)
            }
            finally
            {
                runInAction(()=>{
                    this.isLoading=false
                })
            }
       
    }
     deleteProduct=async (id:number)=>
    {
        this.isLoading=true
        try {
            const response=await ProductService.deleteProduct(id)
            runInAction(()=>{
                if(response.status===200)
                {
                    this.answer=response.data
                    openNotification(this.answer)
                    this.fetchProducts()
                }
                else
                {
                    this.errors=response.data
                    openNotification(this.errors)
                }
            })
        } catch (e) {
            runInAction(()=>{
                this.errors=(e as Error).message
                openNotification(this.errors)
            })
           
        }
        finally
        {
            runInAction(()=>{
                this.isLoading=false
            })
        }

        
    }
     updateProduct=async(product: IProductPropsUpdate)=>
    {
        this.isLoading=true
        try {
            const response=await ProductService.updateProduct(product)
            runInAction(()=>{
                if(response.status===200)
                {
                    this.answer=response.data
                    openNotification(this.answer)
                    this.fetchProducts()
                }
                else
                {
                    this.errors=response.data
                    openNotification(this.errors)
                }
            })  
        } catch (e) {
            runInAction(()=>{
                this.errors=(e as Error).message
            })
           
        }
        finally
        {
            runInAction(()=>{
                this.isLoading=false
            })
        }
    }
     createProduct=async(product:IProductPropsCreate)=>
    {
        this.isLoading=true
        try {
            const response=await ProductService.createProduct(product)
            this.answer=response.data
            openNotification(this.answer)
            if(response.status===201)
            {
                this.fetchProducts()
            }
            else
            {
                this.errors=response.data
            }
        } catch (e) {
            runInAction(()=>{
                this.errors=(e as Error).message
            })
            
        }
        finally
        {
            runInAction(()=>{
                this.isLoading=false
            })
        }
    } 
}
export default new ProductStore()