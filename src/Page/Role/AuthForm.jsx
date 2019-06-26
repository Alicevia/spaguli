import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {Form,Input} from 'antd'
import { Tree } from 'antd';
import menuList from '../../config/menuConfig'
const { TreeNode } = Tree;





export default class AtuhForm extends Component {
    static propTypes={
        role:PropTypes.object.isRequired,
    } 

    constructor(props){
        super(props)
        let {menus} = this.props.role
        this.state={
            checkedKeys:menus
        }
    }
    getTreeNodes=(menuList)=>{
        return menuList.reduce((pre,item)=>{
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children?this.getTreeNodes(item.children):null}
                </TreeNode>
            )
            return pre
        },[])
    }
    onCheck=(a)=>{
        console.log(a)
        this.setState({
            checkedKeys:a
        })
    }
    getMenus=()=>{
        return this.state.checkedKeys
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
        let {role} = this.props
        let {checkedKeys} = this.state
        return (
            <div>
               <Form.Item label={'角色名称'} {...formItemLayout}>
                <Input value={role.name} disabled></Input>
               </Form.Item>
               <Tree defaultExpandAll
                checkable
                checkedKeys={checkedKeys}
                onCheck={this.onCheck}
                >
                {this.tree}
                </Tree>
            </div>
        )
    }
    componentWillMount(){
        this.tree = this.getTreeNodes(menuList)
    }
    componentDidMount(){
      
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            checkedKeys:nextProps.role.menus
        })
    }
}

