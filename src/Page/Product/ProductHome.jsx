import React, { Component } from 'react'
import {Card,Select,Table,Icon,Input,Button, message} from 'antd'
import LinkButton from '../../Components/LinkButton/LinkButton';
import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../api/index'
import * as TYPES from '../../utils/constants'

 


export default class ProductHome extends Component {
    state={
        products:[],
        total:0,
        loading:true,
        searchName:'',
        searchType:'productName'

    }
    initColums(){
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',

            },
            {
                title: '价格',
                dataIndex: 'price',
                render:(price)=>{//指定了对应的属性，传入的是对应的属性值，
                    return '¥'+price
                }
            },
            {
                width:100,
                title: '状态',
                //dataIndex: 'status', //
                render:(product)=>{
                    // console.log(product)
                    let {status,_id} = product
                     status = status===1 ? 2 : 1
                    return (
                        <span>
                            <Button type='primary' 
                            onClick={()=>this.updateStatus(_id,status)}
                            >{status===1?'下架':'上架'}</Button>
                            <br/>
                            <span>{status===1?'在售':'已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width:100,
                title: '操作',
                render:(product)=>{
                    return (
                        <span>
                            <LinkButton onClick={() => this.props.history.push({pathname:'/product/detail',state:{product}})}>详情</LinkButton>
                            <br/>
                            <LinkButton onClick={()=>this.props.history.push({pathname:'/product/addupdate',state:{product}})}>修改</LinkButton>
                        </span>
                    )
                }
            },
        ];
    }
     updateStatus=async (productId,status)=>{
        let result = await reqUpdateStatus(productId,status)
        if (result.status===0) {
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }

    }
    componentWillMount(){
        this.initColums()
    }
    componentDidMount(){
        this.getProducts(1)
    }
    getProducts= async (pageNum)=>{
        this.pageNum = pageNum
        let {searchName,searchType} = this.state
        let result;
        if (searchName) {
            result = await reqSearchProducts({searchName,pageNum,pageSize:TYPES.PAGE_SIZE,searchType})
        }else {
            result = await reqProducts(pageNum,TYPES.PAGE_SIZE);
        }
        if (result.status===0) {
            let {total,list} = result.data
            this.setState({total,products:list,loading:false})
        }

    }

    render() {
        let {products,total,searchType,searchName} = this.state
        let title=(
            <span>
                <Select value={searchType} 
                onChange={value=>this.setState({searchType:value})}
                style={{width:130}}>
                    <Select.Option value='productName'>按名称搜索</Select.Option>
                    <Select.Option value='productDesc'>按描述搜索</Select.Option>
                </Select>
                <Input value={searchName} 
                onChange={e=>this.setState({searchName:e.target.value})} 
                placeholder='请输入关键字' style={{width:180,margin:'0 15px'}}></Input>
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )
        let extra = (
            <Button type='primary' onClick={()=>this.props.history.push('/product/addupdate')}>
                <Icon type='plus'></Icon>
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
               <Table bordered dataSource={products} rowKey='_id'
               loading={this.state.loading} 
               pagination={{total,
                current:this.pageNum,
                defaultPageSize:TYPES.PAGE_SIZE,
                onChange:this.getProducts,
                showQuickJumper:true}}
                columns={this.columns} />
            </Card>
        )
    }
}
