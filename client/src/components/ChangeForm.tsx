import { Input,Form, Select, Row, Button } from "antd";
import { FC, useEffect } from "react";
import { useForm } from "antd/es/form/Form";
import ProductService from "../services/ProductService";
import { isAxiosError } from "axios";
import UseOwnNotification from "../lib/hooks";

type FieldType={
    isStock:boolean
    customer:string
}
interface IPropsForm
{
    product:{
        id:number
        name: string;
        weight: number;
        dateOrder: Date
        isStock:boolean
        customer:string
    },
    changeFetch:()=>void
}
const ChangeForm:FC<IPropsForm> = ({product,changeFetch}) => {
    const {openNotificationWithIcon,contextHolder}=UseOwnNotification()
    const [form]=useForm()
    useEffect(()=>{
        form.setFieldsValue({...product})
    },[product])
    const Submit=(values:FieldType)=>{  
        ProductService.updateProduct({...form.getFieldsValue(),id:product.id}).then(data=>
            {
                if(!isAxiosError(data))
                {
                  openNotificationWithIcon('success','Успешно',data.data)
                }
                else
                {
                  openNotificationWithIcon('error','Ошибка',data.message)
                }
              changeFetch()
            })
    }
    return (
        <>
            {contextHolder}
            <Form
                onFinish={Submit}
                form={form}
            >
                <Form.Item<FieldType>
                    name='isStock'
                    label='В наличии'    
                    rules={[{ required: true, message: 'Выберите наличие!' }]}
                >
                    <Select style={{ width: '100%' }}>
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
                    label="Заказчик"
                    name="customer"
                    rules={[{ required: true, message: 'Введите заказчика!' }]}
                    >
                    <Input/>
                </Form.Item> 
                <Row justify={'end'}>
                    <Button type="primary" htmlType="submit">Сохранить</Button> 
                </Row>
            </Form>
        </>
    );
};

export default ChangeForm;