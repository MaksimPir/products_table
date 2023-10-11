export  interface IProduct {
    id: number
    name: string
    weight: number
    dateOrder: Date
    isStock:boolean
    customer:string
}
export interface IProductPropsCreate extends Omit<IProduct,'id'>{}
export interface IProductPropsUpdate extends Omit<IProduct,'name'|'weight'|'dateOrder'>{}