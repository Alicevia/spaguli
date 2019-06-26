import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {Form,Select,Input} from 'antd'


 class AddForm extends Component {
    static propTypes={
        categorys:PropTypes.array.isRequired,
        parentId:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    } 
    componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render() {
        let {getFieldDecorator} = this.props.form;
        let {categorys,parentId} = this.props
        return (
            <Form>
               <Form.Item>
                   {getFieldDecorator('parentId',{
                       initialValue:parentId
                   })(<Select >
                        <Select.Option value='0'>一级分类</Select.Option>
                        {
                            categorys.map((item,index)=>(
                                <Select.Option key={item._id} value={item._id}>{item.name}</Select.Option>
                            ))
                        }
                    </Select>)}
                    
               </Form.Item>
               <Form.Item>
                {getFieldDecorator('categoryName',{
                    initialValue:'',
                    rules:[
                        {required: true, message: '分类名称必须输入'}
                    ]
                })(<Input placeholder='请输入分类的名称'></Input>)}
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm)