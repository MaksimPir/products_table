import axios, { AxiosResponse } from "axios";
import { IProduct, IProductPropsCreate, IProductPropsUpdate } from "../model";

export default class ProductService
{
    static BASE_URL:string='http://localhost:5000/'
    static async getAllProducts():Promise<IProduct[]>
    {
        return (await axios.get<IProduct[]>(this.BASE_URL+'api/products')).data
    }
    static async getProductById(id:number):Promise<AxiosResponse<IProduct>>
    {
        return axios.get<IProduct>(this.BASE_URL+`api/products/${id}`)
    }
    static async deleteProduct(id:number):Promise<AxiosResponse>
    {
        return await  axios.delete(this.BASE_URL+`api/products/${id}`)
    }
    static async updateProduct(product: IProductPropsUpdate):Promise<AxiosResponse>
    {
        return await  axios.patch(this.BASE_URL+`api/products`,{...product})
    }
    static async createProduct(product:IProductPropsCreate):Promise<AxiosResponse>
    {
        return await axios.post(this.BASE_URL+`api/products`,{...product})
    }
}