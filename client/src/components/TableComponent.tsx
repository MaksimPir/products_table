import {FC, useEffect, useState} from 'react';
import {Button, Modal, Select, SelectProps, Space} from 'antd'
import Table, { ColumnType, ColumnsType } from 'antd/es/table';
import { convertDate, openNotification } from '../lib/helpers';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import AddForm from './AddForm';
import ChangeForm from './ChangeForm';
import { IProduct } from '../model';
import ProductService from '../services/ProductService';

  
const TableComponent:FC = () => {
    const [searchText, setSearchText] = useState('')
    const [isFetch, setIsFetch]=useState(true)
    const [options, setOptions]=useState<SelectProps['options']>()
    const [products,setProducts]=useState<IProduct[]>([])
    const [visibleModalAdd,setVisibleModalAdd]=useState(false)
    const [idProductToDelete,setIdProductToDelete]=useState<number|null>(null)
    const [productToUpdate, setProductToUpdate]=useState<IProduct|null>(null)
    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };
    useEffect(()=>{
      if(isFetch)
      {
        const response= ProductService.getAllProducts()
        response.then((data)=>
        {
          const newOptions=data.map((el,index)=> {return{value:el.name, label:el.name}})
          setOptions(newOptions)
          setProducts(data)
        })
        setIsFetch(false)
      }
    },[isFetch])
    const changeFetch=()=>{
      setIsFetch(prev=>!prev)
    }
    const deleteHandler=()=>{
      if(idProductToDelete !==null) ProductService.deleteProduct(idProductToDelete).then(data=>openNotification(data.data))
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
                    onClick={() => clearFilters && handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                  >
                    Reset
                  </Button>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      confirm({ closeDropdown: false });
                    }}
                  >
                    Filter
                  </Button>
                  <Button
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
                <Button onClick={()=>changeHandler(record.id)}>Изменить</Button>
                <Button onClick={()=>setIdProductToDelete(record.id)}>Удалить</Button>
              </Space>
            ),
          },
      ];
      return  ( 
        <>
            <Button onClick={()=>setVisibleModalAdd(true)} type="primary" style={{ marginBottom: 16 }}>
                Добавить товар
            </Button>
            <Table 
              rowKey={'id'}
              columns={columns} dataSource={products} /> 
            <Modal title='Добавить товар ' open={visibleModalAdd} footer={null} onCancel={()=>{setVisibleModalAdd((prev)=>!prev)}}>
                <AddForm changeFetch={changeFetch}/>
            </Modal>
            <Modal title='Удалить товар' open={idProductToDelete!==null} 
                footer={[<Button onClick={deleteHandler}>Удалить</Button>,
                        <Button onClick={()=>setIdProductToDelete(null)}>Отмена</Button>]} 
                onCancel={()=>{setIdProductToDelete(null)}}>
                <div> {products.map((el)=>{
                    if(el.id===idProductToDelete)
                    {
                        return (
                        <>
                            <p>{el.id} {el.name}</p>
                        </>
                        )
                    }
                })}</div>
            </Modal>
            <Modal title='Изменить товар'  open={productToUpdate!==null} footer={null} onCancel={()=>{setProductToUpdate(null)}}>
                <ChangeForm product={productToUpdate!} changeFetch={changeFetch}/>
            </Modal>
        </>
      )      
      ;
};

export default TableComponent;