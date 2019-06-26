import React, { Component } from 'react'
import {Table,Card,Button,Modal, message} from 'antd'
import * as TYPES from '../../utils/constants'
import  {reqRoles,reqAddRole,reqUpdateRole} from '../../api'
import AddRoleForm from './AddRoleForm'
import AtuhForm from './AuthForm';
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {formateDate} from '../../utils/dateUtils'

export default class Role extends Component {
    constructor(props){
        super(props)
        this.state={
            roles:[],
            role:{},
            isShowAdd:false,
            isShowUpdate:false
        }
        this.menus = React.createRef()
    }
    async getRoles(){
        let result = await reqRoles()
        console.log(result)
        if (result.status===0) {
            this.setState({
                roles:result.data
            })
        }
    }
    
    initialColumns(){
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render:formateDate
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render:formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
                key: 'auth_name',
            },
        ]
    }
    onRow=(role)=>{
        return {
            onClick:()=>{
                this.setState({
                    role
                })
            }
        }
    }
    addRoles=()=>{
        this.form.validateFields(async (err,values)=>{
            if (!err) {
                this.form.resetFields()
                let result =await reqAddRole(values.roleName)
                if (result.status===0) {
                    message.success('添加角色成功')

                    // this.getRoles()
                    let role = result.data
                    this.setState((state)=>({
                       
                        roles:[...state.roles,role]
                    }))
                }else {
                    message.error('添加角色失败')
                }
            }
        })
        this.setState({
            isShowAdd:false
        })
    }

    updateRole=async ()=>{
        let role = this.state.role
        let menus = this.menus.current.getMenus()
        role.menus = menus
        role.auth_name = memoryUtils.user.username
        let result = await reqUpdateRole(role)
        if (result.status===0) {
            message.success('更新角色权限成功')
            if (role._id===memoryUtils.user.role._id) {
                memoryUtils.user={}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('当前用户权限变更，请重新登录')
            }else{
                this.setState({
                    roles:[...this.state.roles]
                })
            }
        }else{
            message.error('更新角色权限失败')
        }
        this.setState({
            isShowUpdate:false

        })
    }

    render() {
        let {roles,role,isShowAdd,isShowUpdate} = this.state
        
        let title =(
           <span>
                <Button type='primary' onClick={()=>{this.setState({isShowAdd:true})}}>创建角色</Button> &nbsp;&nbsp;
                <Button type='primary' onClick={()=>{this.setState({isShowUpdate:true})}} disabled={!role._id}>设置角色权限</Button>
           </span>
        )

        return (
            <Card title={title}>
                <Table dataSource={roles} bordered rowKey='_id'
                    rowSelection={{type:'radio',
                    selectedRowKeys:[role._id],
                    onSelect:(role)=>{
                        this.setState({
                            role
                        })
                    }  
                }}
                columns={this.columns} 
                pagination={{defaultPageSize:TYPES.PAGE_SIZE}}
                onRow={this.onRow}
                ></Table>

                 <Modal
                title="添加角色"
                visible={isShowAdd}
                onOk={this.addRoles}
                onCancel={()=>{this.setState({isShowAdd:false})}}
                >
                <AddRoleForm
                setForm={(form)=>{this.form = form}}
                ></AddRoleForm>
                </Modal>


                <Modal
                title="设置角色权限"
                visible={isShowUpdate}
                onOk={this.updateRole}
                onCancel={()=>{this.setState({isShowUpdate:false})}}
                >
                    <AtuhForm ref={this.menus} role={role}></AtuhForm>
                </Modal>

               


            </Card>
        )
    }
    componentWillMount(){
        this.initialColumns()
    }
    componentDidMount(){
        this.getRoles()
    }
}
