import {FC, useEffect, useState} from 'react';
import {Button, Modal, Select, SelectProps, Space} from 'antd'
import Table, { ColumnType, ColumnsType } from 'antd/es/table';
import { convertDate } from '../lib/helpers';
import { SearchOutlined } from '@ant-design/icons';
import AddForm from './AddForm';
import ChangeForm from './ChangeForm';
import { IProduct } from '../model';
import ProductService from '../services/ProductService';
import { isAxiosError } from 'axios';
import UseOwnNotification from '../lib/hooks';

  
const TableComponent:FC = () => {
    const {openNotificationWithIcon,contextHolder}=UseOwnNotification()
    const [isFetch, setIsFetch]=useState(true)
    const [options, setOptions]=useState<SelectProps['options']>()
    const [products,setProducts]=useState<IProduct[]>([])
    const [visibleModalAdd,setVisibleModalAdd]=useState(false)
    const [idProductToDelete,setIdProductToDelete]=useState<number|null>(null)
    const [productToUpdate, setProductToUpdate]=useState<IProduct|null>(null)
    const handleReset = (clearFilters: () => void) => {
        clearFilters();
    };
    useEffect(()=>{
      if(isFetch)
      {
        const response= ProductService.getAllProducts()
        response.then((data)=>
        {
          if(!isAxiosError( data))
          {
            const newOptions=data.map((el,index)=> {return{value:el.name, label:el.name}})
            setOptions(newOptions)
            setProducts(data)
          }
          else
          {
            openNotificationWithIcon('error','Ошибка',data.message)
          }
         
        })
        setIsFetch(false)
      }
    },[isFetch])
    const changeFetch=()=>{
      setIsFetch(prev=>!prev)
    }
    const deleteHandler=()=>{
      if(idProductToDelete !==null) ProductService.deleteProduct(idProductToDelete).then(data=>
        {
          if(!isAxiosError(data))
          {
            openNotificationWithIcon('success','Успешно',data.data)
          }
          else
          {
            openNotificationWithIcon('error','Ошибка',data.message)
          }
        })
      setIdProductToDelete(null)
      changeFetch()
    }
    const changeHandler=(id:number)=>{
        const findProduct=products.find(el=>el.id===id)
        if(findProduct)setProductToUpdate(findProduct)
    }
      const getColumnSearchProps = (): ColumnType<IProduct> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
          <div style={{ padding: 8, display: 'grid'}} onKeyDown={(e) => e.stopPropagation()}>
            <Select
                showSearch
                style={{ width: 200 }}
                value={selectedKeys}
                placeholder="Search to Select"
                optionFilterProp="children"
                onChange={(e:any) => 
                    {
                      setSelectedKeys(e ? [e] : [])
                    }
                }
                filterOption={(input, option) => (option?.label ? option?.label+'':'').includes(input)}
                filterSort={(optionA, optionB) =>
                (optionA?.label ? optionA?.label+''  :'').toLowerCase().localeCompare((optionB?.label ? optionB?.label+''  :'').toLowerCase())
                }
                options={options}
            />
            <Space>
                <div style={{'marginTop': '5%'}}>
                    <Button
                     key={'reset'}
                    onClick={() => clearFilters && handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                  >
                    Reset
                  </Button>
                  <Button
                   key={'filter'}
                    type="link"
                    size="small"
                    onClick={() => {
                      confirm({ closeDropdown: false });
                    }}
                  >
                    Filter
                  </Button>
                  <Button
                    key={'close'}
                    type="link"
                    size="small"
                    onClick={() => {
                      close();
                    }}
                  >
                    close
                  </Button>
                </div>
            </Space>
          </div>
        ),

        filterIcon: (filtered: boolean) => (
          <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
        {            
            return  record['name']===value
        },  
      });
      
    const columns: ColumnsType<IProduct> = [
        {
            title: 'ID товара',
            dataIndex: 'id',
            key: 'id',
            sorter:(a, b) => a.id-b.id
        },
        {
            title: 'Наименование товара',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps(),
            sorter:(a, b) => a.name.localeCompare(b.name)
        },
        {
            title: 'Вес товара',
            dataIndex: 'weight',
            key: 'weight',
        },
        {
            title: 'Дата заказа',
            dataIndex: 'dateOrder',
            key: 'dateOrder',
            sorter: (a, b) => new Date(a.dateOrder).valueOf() - new Date(b.dateOrder).valueOf(),
            render:((date:Date)=>convertDate(new Date(date)))
        },
        {
            title: 'Наличие на складе',
            dataIndex: 'isStock',
            key: 'isStock',
            render:((el:boolean)=>el?'Да':'Нет')
        },
        {
            title: 'Заказчик',
            dataIndex: 'customer',
            key: 'customer',
        },
        {
            title: 'Меню',
            key: 'action',
            render: (_, record) => (
              <Space size="middle">
                <Button key={'change'} onClick={()=>changeHandler(record.id)}>Изменить</Button>
                <Button key={'del'} onClick={()=>setIdProductToDelete(record.id)}>Удалить</Button>
              </Space>
            ),
          },
      ];
      return  ( 
        <>
            {contextHolder}
            <Button onClick={()=>setVisibleModalAdd(true)} type="primary" style={{ marginBottom: 16 }}>
                Добавить товар
            </Button>
            <Table 
              rowKey={'id'}
              columns={columns} dataSource={products} /> 
            <Modal key={'modalAdd'} title='Добавить товар ' open={visibleModalAdd} footer={null} onCancel={()=>{setVisibleModalAdd((prev)=>!prev)}}>
                <AddForm changeFetch={changeFetch}/>
            </Modal>
            <Modal key={'modalDel'} title='Удалить товар' open={idProductToDelete!==null} 
                footer={[<Button key={'del'} onClick={deleteHandler}>Удалить</Button>,
                        <Button key={'cancel'} onClick={()=>setIdProductToDelete(null)}>Отмена</Button>]} 
                onCancel={()=>{setIdProductToDelete(null)}}>
                 {products.map((el)=>{
                    if(el.id===idProductToDelete)
                    {
                        return (
                          <p key={el.id}>{el.id} {el.name}</p>
                        )
                    }
                })}
            </Modal>
            <Modal key={'modalChange'} title='Изменить товар'  open={productToUpdate!==null} footer={null} onCancel={()=>{setProductToUpdate(null)}}>
                <ChangeForm product={productToUpdate!} changeFetch={changeFetch}/>
            </Modal>
        </>
      )      
      ;
};

export default TableComponent;