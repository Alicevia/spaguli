import React, { Component } from 'react'
import {Form,Card,Input,Upload,Cascader,Button,Icon,message} from 'antd'
import LinkButton from '../../Components/LinkButton/LinkButton';
import {reqCategory,reqAddOrUpdateProduct} from '../../api/index'
import PicturesWall from './PicturesWall'
import RichTextEditor from './RichTextEditor';

 class ProductUpdate extends Component {
    state = {
        options:[]
      };
    constructor(props){
        super(props)
        this.pw = React.createRef()
        this.detail = React.createRef()
    }

    componentDidMount(){
        this.getCategory('0')
    }
    componentWillMount(){
        let {product} = this.props.location.state
        this.isUpdate = !!product
        this.product = product||{} 
    }
    getCategory=async (parentId)=>{
        let result = await reqCategory(parentId)

        if (parentId==='0') {
            this.initOptions(result.data)
        }else{
            return result.data
        }

    }
    async initOptions(category){
        let options = category.map(item=>{
            return { 
                value: item._id,
                label: item.name,
                isLeaf: false,
            }
        })
        let {isUpdate,product:{pCategoryId,categoryId}} = this
        if (isUpdate&& pCategoryId!==0) {
            let subCategory = await this.getCategory(pCategoryId)
            let childOptions = subCategory.map(item=>{
                return {
                    value: item._id,
                    label: item.name,
                    isLeaf: true,
                }
            })
            let targetOption = options.find(option=>option.value===pCategoryId)
            targetOption.children = childOptions
        }
        this.setState({
            options
        })
    }
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        console.log(targetOption)
        targetOption.loading = true;
        let subCategory =await this.getCategory(targetOption.value)
        targetOption.loading = false;
        if (subCategory && subCategory.length>0) {
            let childOptions = subCategory.map(item=>{
                return {
                    value: item._id,
                    label: item.name,
                    isLeaf: true,
                }
            })
            targetOption.children = childOptions
        }else {
            targetOption.isLeaf = true
        }
        // load options lazily
        this.setState({
            options: [...this.state.options],
          })
  
    };
    





    submit=()=>{
        this.props.form.validateFields(async (err,values)=>{
            if (!err) {
                let {name,desc,price,categoryIds}=values
                let pCategoryId,categoryId;
                if (categoryIds.length===1) {
                    pCategoryId='0'
                    categoryId = categoryIds[0]
                }else {
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                let imgs = this.pw.current.getImgs()
                let detail = this.detail.current.getDetail()
     
                let product = {name,desc,price,imgs,detail}
                if (this.isUpdate) {
                    product._id = this.product._id
                }
                let result =await reqAddOrUpdateProduct(product)
             
                if (result.status===0) {
                    message.success(`${this.isUpdate?'更新':'添加'}商品成功`)
                    this.props.history.goBack()
                }else {
                    message.error(`${this.isUpdate?'更新':'添加'}商品失败`)

                }



            }
        })
    }

    validatorPrice=(rule,value,callback)=>{
        if (value*1>0) {
            callback()//验证通过
        }else {
            callback('价格必须大于0')//验证不通过 提示
        }
    }
    render() {
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 2 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 8 },
            },
          };
        let {getFieldDecorator} = this.props.form
        let {isUpdate,product} = this
        let {pCategoryId,categoryId,imgs,detail} = product
        // console.log(detail)
        let categoryIds=[]
        if (isUpdate) {
            if (pCategoryId===0) {
                categoryIds.push(pCategoryId)
                
            }else {
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
          
        }
        let title = (
            <span>
                <LinkButton onClick={()=>this.props.history.goBack()}>
                    <Icon type='arrow-left'></Icon>
                </LinkButton>
                <span>添加商品</span>
            </span>
        )

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Form.Item label='商品名称'>
                        {getFieldDecorator('name',{
                            initialValue:product.name,
                            rules:[
                                {required:true,message:'必须输入商品名称'}
                            ]
                        })(
                            <Input placeholder='商品名称' ></Input>
                        )}
                    </Form.Item>
                    <Form.Item label='商品描述'>
                    {getFieldDecorator('desc',{
                            initialValue:product.desc,
                            rules:[
                                {required:true,message:'必须输入商品描述'}
                            ]
                        })(
                            <Input.TextArea placeholder="商品描述" autosize={{ minRows: 2, maxRows: 6 }} />
                        )}
                    
                    </Form.Item>
                    <Form.Item label='商品价格'>
                        {getFieldDecorator('price',{
                            initialValue:product.price,
                            rules:[
                                {required:true,message:'必须输入商品价格'},
                                {validator:this.validatorPrice}
                            ]
                        })(
                            <Input type='number' addonAfter='元' placeholder='商品价格'></Input>
                        )}                       
                    </Form.Item>
                    <Form.Item label='商品分类'>
                       {
                           getFieldDecorator('categoryIds',{
                               initialValue:categoryIds,
                               rules:[
                                   {required:true,message:'必须选择分类'}
                               ]
                           })( 
                           <Cascader
                            options={this.state.options}
                            loadData={this.loadData}                           
                             />)
                       }
                    </Form.Item>
                    <Form.Item label='商品图片'>
                        <PicturesWall ref={this.pw} imgs={imgs}></PicturesWall>
                    </Form.Item>
                    <Form.Item label='商品详情' labelCol={{span:2}} wrapperCol={{span:20}}>
                       <RichTextEditor ref={this.detail} detail={detail}></RichTextEditor>
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Form.Item>
                </Form>

            </Card>
        )
    }
}

export default Form.create()(ProductUpdate)