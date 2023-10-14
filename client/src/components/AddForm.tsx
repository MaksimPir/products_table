import { Input,Form, Select, Row, Button, DatePicker, InputNumber } from "antd";
import { FC, useState } from "react";
import { openNotification } from "../lib/helpers";
import { Dayjs } from "dayjs";
import { useForm } from "antd/es/form/Form";
import productStore from '../store/Product-store'
import { observer } from "mobx-react-lite";

type FieldType={
    name: string;
    weight: number;
    dateOrder: Date
    isStock:boolean
    customer:string
}
interface IAddFormProps{
    changeFetch:()=>void
}

const AddForm:FC<IAddFormProps> = observer(({changeFetch}) => {
    const [form]=useForm()
    const [product,setProduct]=useState<FieldType>({} as FieldType)
    const onCalendarChange=(value: Dayjs | null, dateString: string)=>{
        if(value)
        {
            setProduct({...product, dateOrder:value.toDate()})
        }
    }
    const Submit=(values:FieldType)=>{  
        productStore.createProduct(product)
        form.resetFields()
        setProduct({} as FieldType)
        changeFetch()
    }
    const onChangeStock=(value:boolean)=>
    {
        setProduct({...product, isStock:value})
    }
    return (
        <Form
            form={form}
            onFinish={Submit}
        >
            <Form.Item<FieldType>
                label="Название товара"
                name="name"
                rules={[{ required: true, message: 'Введите название!' }]}
            >
                <Input value={product.name}  onChange={(el)=>{setProduct({...product, name:el.target.value})}}/>
            </Form.Item> 
            <Form.Item<FieldType>
                label="Вес"
                name="weight"
                rules={[{ required: true, message: 'Введите вес товара!' }]}
                >
                <InputNumber min={0}  onChange={(el)=>{setProduct({...product, weight: el!  })}}/>
            </Form.Item>
            <Form.Item<FieldType>
                name='isStock'
                label='В наличии'    
                rules={[{ required: true, message: 'Выберите наличие!' }]}
            >
                <Select
                    onChange={onChangeStock}
                    style={{ width: '100%' }}
                    >
                        <Select.Option key='Yes' value={true}  >
                            <div>
                                Да
                            </div>
                        </Select.Option>
                        <Select.Option key='No' value={false}  >
                            <div>
                                Нет
                            </div>
                        </Select.Option>
                    </Select>
            </Form.Item>
            <Form.Item<FieldType>
                name='dateOrder'
                label='Дата заказа'
                rules={[{ required: true, message: 'Введите дату заказа!' }]}
            >
                <DatePicker onChange={onCalendarChange}/>        
            </Form.Item>
            <Form.Item<FieldType>
                label="Заказчик"
                name="customer"
                rules={[{ required: true, message: 'Введите заказчика!' }]}
            >
                <Input value={product.customer}  onChange={(el)=>{setProduct({...product, customer:el.target.value})}}/>
            </Form.Item> 
            <Row justify={'end'}>
                <Button type="primary" htmlType="submit">Сохранить</Button> 
            </Row>
        </Form>
    );
});

export default AddForm;