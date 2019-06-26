import React, { Component } from 'react'
import {Card,Table,Button,Icon,Modal} from 'antd'
import LinkButton from '../../Components/LinkButton/LinkButton'
import {reqCategory,reqUpdateCategory,reqAddCategory} from '../../api/index'
import AddForm from './AddForm'
import UpdateForm from './UpdateForm';

export default class Category extends Component {
    state={
        loading:true,
        categorys:[],
        subCategorys:[],
        parentId:'0',
        parentName:'',
        showStatus:0,//0两个都不显示 1 显示添加 2 显示更新


    }
    componentWillMount(){
        this.initColums()
    }
    initColums = ()=>{
         this.columns = [
            {
              title: '分类的名称',
              dataIndex: 'name',
              
            },
            {
              title: '操作',
              width:300,
              render:(category)=>{
                return(
                    <span>
                        <LinkButton onClick={this.showUpdate.bind(null,category)}>修改分类</LinkButton>
                        {this.state.parentId==='0'?(<LinkButton onClick={this.showSubCategorys.bind(null,category)}>查看子分类</LinkButton>):null}
                        
                    </span>
                )
              }
            },
           
          ];
    }
    showSubCategorys=(category)=>{
        this.setState({
            parentId:category._id,
            parentName:category.name

        },()=>{
            this.getCategorys()
        })
    }

    showCategorys(){
        this.setState({
            parentId:'0',
            parentName:'',
            subCategorys:[]
        })
    }

    handleCancel=()=>{
        this.setState({
            showStatus:0
        })

    }
    showUpdate=(category)=>{
        this.category = category;
        this.setState({
            showStatus:2
        })
    }
    updateCategory= ()=>{
        this.form.validateFields(async (err,value)=>{
            if (!err) {
                this.handleCancel()
                let categoryId = this.category._id
                let categoryName =value.categoryName
                this.form.resetFields()
                let result = await reqUpdateCategory(categoryId,categoryName)
                if (result.status===0) {
                    this.getCategorys()
                }
            }
        })
        
    } 

    showAdd=()=>{
       this.setState({
           showStatus:1
       })
    }

    addCategory = ()=>{
        this.form.validateFields(async(err,value)=>{
            if (!err) {
                this.handleCancel()
                let {categoryName,parentId} =value 
                this.form.resetFields()
                let result = await reqAddCategory(parentId,categoryName)
                if (result.status===0) {
                    if (this.state.parentId===parentId) {
                        this.getCategorys()
                    }else if(parentId==='0' ){
                        this.getCategorys(parentId)
                    }
        
                }
            }
        })

    }

    componentDidMount(){
        this.getCategorys()
    }
    getCategorys= async (parentId)=>{
        parentId = parentId||this.state.parentId
        let result = await reqCategory(parentId)
        if (result.status===0) {
            if (parentId==='0') {
                this.setState({
                    categorys:result.data,
                    loading:false
                })
            }else{
                this.setState({
                    subCategorys:result.data,
                    loading:false
                })
            }           
        }      
    }


    render() {
        const {categorys,loading,parentId,showStatus,
            subCategorys,parentName} = this.state
        let category = this.category||{}
        let extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type='plus'></Icon>
                添加
            </Button>
        )

        let title = parentId==='0'?(<LinkButton >一级分类列表</LinkButton>):(<span>
            <LinkButton onClick={()=>{this.showCategorys()}} >一级分类列表</LinkButton>
            <Icon type='arrow-right'></Icon>
            <span>{parentName}</span>
        </span>)
        return (
            <Card title={title} extra={extra} style={{ width: '100%' }}>
                <Table bordered dataSource={parentId==='0'?categorys:subCategorys} 
                loading={loading}
                rowKey={'_id'}
                columns={this.columns} />  
                <Modal
                title="添加分类"
                visible={showStatus===1}
                onOk={this.addCategory}
                onCancel={this.handleCancel}
                >
                <AddForm categorys={categorys} 
                setForm={(form)=>{this.form = form}}
                parentId={parentId}></AddForm>
                </Modal>

                <Modal
                title="更新分类"
                visible={showStatus===2}
                onOk={this.updateCategory}
                onCancel={this.handleCancel}
                >
                <UpdateForm categoryName={category.name} 
                setForm={(form)=>{this.form = form}}></UpdateForm>
                </Modal>
            </Card>
        )
    }
}
