import React, { Component } from 'react'
import {Card,Icon,List} from 'antd'
import LinkButton from '../../Components/LinkButton/LinkButton';
import {withRouter} from 'react-router-dom'
import {reqCategoryNameById} from '../../api/index'
class ProductDetail extends Component {
    state={
        cName1:'',
        cName2:''
    }
    componentWillMount(){
        let {product} = this.props.location.state;
        if (product) {
            this.product = product
            // window.sessionStorage.setItem('product',JSON.stringify(product))
        }

    }
    async componentDidMount(){
        // let product = sessionStorage.getItem('product')
        // product = JSON.parse(product)
        let {pCategoryId,categoryId} = this.product
        if (pCategoryId===0) {
            let result =await reqCategoryNameById(categoryId)
            this.setState({
                cName1:result.data.name
            })
        }else {
       
            let results = await Promise.all([reqCategoryNameById(pCategoryId),reqCategoryNameById(categoryId)])
            this.setState({
                cName1:results[0].data.name,
                cName2:results[1].data.name,
            })
        }
    }
    render() {
        let {name,desc,price,detail} = this.product
        let {cName1,cName2} = this.state
        let title=(
            <span>
                <LinkButton>
                    <Icon type='arrow-left'
                    onClick={()=>this.props.history.go(-1)}
                    style={{marginRight:15,fontSize:18}}
                    ></Icon>
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className='product-detial'>
                <List>
                    <List.Item>
                        <span className='left'>商品名称:</span>
                        <span>{name}</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>商品描述:</span>
                        <span>{desc}</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>商品价格:</span>
                        <span>{price}</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>所属分类:</span>
                        <span>{cName1}{cName2?'-->'+cName2:''}</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>商品图片:</span>
                        <span>小米笔记本air</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html:detail}}></span>
                    </List.Item>
                </List>
            </Card>
        )
    }
}
export default ProductDetail