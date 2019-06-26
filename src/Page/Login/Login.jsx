import React, { Component } from 'react'
import './Login.less'
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import {reqLoign} from '../../api/index'
import {withRouter,Redirect} from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
 class Login extends Component {

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
        //   if (!err) {
            let {username,password} = values
            let result = await reqLoign(username,password)
            console.log(result)
            memoryUtils.user = result.data
            storageUtils.saveUser(result.data)
            this.props.history.push('/')

          
            // }
        });
    }
    
    render() {
        let user = memoryUtils.user
        if (memoryUtils.user&&user._id) {
            return <Redirect to='/'></Redirect>
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='login'>
                <header className="login-header">
                    <img src={require('../../assets/images/logo.png')} alt=""/>
                    <h1>react 后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Username"
                        />,
                    )}
                    </Form.Item>
                    <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="Password"
                        />,
                    )}
                    </Form.Item>
                    <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                       登录
                    </Button>
        
                    </Form.Item>
                </Form>
                </section>
            </div>
        )
    }
}

let login = Form.create()(Login)

export default withRouter(login)




