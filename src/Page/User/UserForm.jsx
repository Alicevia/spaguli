import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import {Form,Input,Select} from 'antd'




 class UserForm extends PureComponent {
    static propTypes={
        setForm:PropTypes.func.isRequired,
        roles:PropTypes.array.isRequired,
        user:PropTypes.object
    } 


    render() {
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

        let {getFieldDecorator} = this.props.form;
        let {roles,user} = this.props
      
        let {_id='',username='',phone='',email='',role_id=''} = user
        console.log( Object.keys(user).length===0)
        return (
            <Form  {...formItemLayout}>
               <Form.Item label='用户名'>
                {getFieldDecorator('username',{
                    initialValue:username,
                    rules:[
                        {required: true, message: '用户名称必须输入'}
                    ]
                })(<Input placeholder='请输入用户名'></Input>)}
                </Form.Item>
                { Object.keys(user).length!==0?null:(
                        <Form.Item label='密码'>
                    {getFieldDecorator('password',{
                        initialValue:'',
                        rules:[
                            {required: true, message: '密码不能为空'}
                        ]
                    })(<Input type='password' placeholder='请输入密码'></Input>)}
                    </Form.Item>
                )}
                
                <Form.Item label='手机号'>
                {getFieldDecorator('phone',{
                    initialValue:phone,
                    rules:[
                        {required: true, message: '手机号不能为空'}
                    ]
                })(<Input placeholder='请输入手机号'></Input>)}
                </Form.Item>
                <Form.Item label='邮箱'>
                {getFieldDecorator('email',{
                    initialValue:email,
                    rules:[
                        {required: true, message: '手机号不能为空'}
                    ]
                })(<Input placeholder='请输入邮箱'></Input>)}
                </Form.Item>
                <Form.Item label='角色'>
                {getFieldDecorator('role_id',{
                    initialValue:role_id,
                    rules:[
                        {required: true, message: '请选择一个角色'}
                    ]
                })(<Select>
                    {roles.map(item=>{
                        return (
                            <Select.Option key={item._id} value={item._id}>{item.name}</Select.Option>
                        )
                    })}
                    
                </Select>)}
                </Form.Item>
            </Form>
        )
    }
    componentWillMount(){
        this.props.setForm(this.props.form)
    }
}

export default Form.create()(UserForm)