import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {Form,Input} from 'antd'




 class AddRoleForm extends Component {
    static propTypes={
        setForm:PropTypes.func.isRequired,
    } 


    render() {
        let {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 4 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 20 },
            },
          }; 
        return (
            <Form>
               <Form.Item label={'角色名称'} {...formItemLayout}>
                {getFieldDecorator('roleName',{
                    initialValue:'',
                    rules:[
                        {required: true, message: '角色名称必须输入'}
                    ]
                })(<Input placeholder='角色入分类的名称'></Input>)}
                </Form.Item>
            </Form>
        )
    }
    componentWillMount(){
        this.props.setForm(this.props.form)
    }
}

export default Form.create()(AddRoleForm)