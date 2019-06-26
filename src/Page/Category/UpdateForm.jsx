import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Form,Select,Input} from 'antd'


 class UpdateForm extends Component {
    static propTypes = {
        categoryName:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    }
    componentWillMount(){
        this.props.setForm(this.props.form)
    }
    render() {
        let {getFieldDecorator} = this.props.form;
        let categoryName = this.props.categoryName
        return (
            <Form>
                <Form.Item>
                {getFieldDecorator('categoryName',{
                    initialValue:categoryName,
                    rules:[
                        {required: true, message: '分类名称必须输入'}
                    ]
                })(<Input placeholder='请输入分类的名称'></Input>)}
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(UpdateForm)