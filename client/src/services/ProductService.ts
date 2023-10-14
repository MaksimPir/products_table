import axios, { AxiosError, AxiosResponse } from "axios";
import { IProduct, IProductPropsCreate, IProductPropsUpdate } from "../model";

export default class ProductService
{
    static BASE_URL:string='http://localhost:5000/'
    static async getAllProducts():Promise<IProduct[]|AxiosError>
    {
        try {
            return  (await axios.get<IProduct[]>(this.BASE_URL+'api/products')).data
        } catch (error) {
            if(axios.isAxiosError(error))
            {
                console.log('eee',error.message);
                return error
            }
            throw error
        }
        
    }
    static async getProductById(id:number):Promise<AxiosResponse<IProduct>>
    {
        return axios.get<IProduct>(this.BASE_URL+`api/products/${id}`)
    }
    static async deleteProduct(id:number):Promise<AxiosResponse|AxiosError>
    {
        try {
            return await  axios.delete(this.BASE_URL+`api/products/${id}`)
        } catch (error) {
            if(axios.isAxiosError(error))
            {
                console.log('eee',error.message);
                return error
            }
            throw error
        }
       
    }
    static async updateProduct(product: IProductPropsUpdate):Promise<AxiosResponse|AxiosError>
    {
        try {
            return await  axios.patch(this.BASE_URL+`api/products`,{...product})
        } catch (error) {
            if(axios.isAxiosError(error))
            {
                console.log('eee',error.message);
                return error
            }
            throw error
        }
    }
    static async createProduct(product:IProductPropsCreate):Promise<AxiosResponse|AxiosError>
    {
        try {
            return await axios.post(this.BASE_URL+`api/products`,{...product})
        } catch (error) {
            if(axios.isAxiosError(error))
            {
                console.log('eee',error.message);
                return error
            }
            throw error
        }
    }
}