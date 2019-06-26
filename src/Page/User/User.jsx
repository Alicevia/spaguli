import React, { Component } from 'react'
import {Card,Table,Modal,Button, message} from 'antd'
import LinkButton from '../../Components/LinkButton/LinkButton'
import * as TYPES from '../../utils/constants'
import {reqUsers, reqDeleteUser,reqAddOrUpdateUser} from '../../api/index'
import { formateDate } from '../../utils/dateUtils';
import UserForm from './UserForm';
export default class User extends Component {
    constructor(props){
        super(props)
        this.state={
            users:[],
            roles:[],
            isShow:false
        }
    }
    initColums=()=>{
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render:formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render:(role_id)=>{
                    return this.roleNames[role_id]
                }
            },
            {
                title: '操作',
                render:(user)=>{
                    return (
                        <span>
                             <LinkButton onClick={()=>this.change(user)}>修改</LinkButton>&nbsp;&nbsp;
                             <LinkButton onClick={()=>this.deleteUser(user)}>删除</LinkButton>
                        </span>
                    )
                }
            },
        ]
    }
    initRoleName(roles){
        let roleName = roles.reduce((pre,role)=>{
            pre[role._id] = role.name
            return pre
        },{})
        this.roleNames = roleName
    }
    getUsers=async()=>{
        let result =await reqUsers()
        let {users,roles} = result.data
        if (result.status===0) {
            this.initRoleName(roles)
            this.setState({
                users,
                roles
            })
        }
    }
    deleteUser(user){
        Modal.confirm({
            title: `您确定删除${user.username}吗？`,
            onOk:async()=> {
                let result =await reqDeleteUser(user._id)
                if (result.status===0) {
                    message.success(`删除${user.username}成功！`)
                    this.getUsers()
                }else{
                    message.error(`删除${user.username}失败！`)
                }
            },
         
          })
    }
    addOrUpdateUser=()=>{
        this.form.validateFields(async(err,values)=>{
            if (!err && Object.keys(this.user).length===0) {
                let result = await reqAddOrUpdateUser(values)
                if (result.status===0) {
                    message.success('添加用户成功')
                    this.getUsers()
                }else {
                    message.error('添加用户失败')
                }
                this.setState({
                    isShow:false
                })
            }else if(!err && Object.keys(this.user).length!==0){
                values._id = this.user._id
                let result = await reqAddOrUpdateUser(values)
                if (result.status===0) {
                    message.success('更新用户信息成功')
                    this.getUsers()
                }else{
                    message.error('更新用户信息失败')

                }
                this.setState({
                    isShow:false
                })
            }
        })
    }
    change=(user)=>{
        this.user = user
        this.setState({isShow:true})

    }

    render() {
        let {users,isShow,roles} = this.state
        let {user={}} = this
        let title =(
           <span>
               <Button type='primary' onClick={()=>this.setState({isShow:true})}>创建用户</Button>
           </span>
        )

        return (
            <Card title={title}>
                <Table dataSource={users} bordered rowKey='_id'
                columns={this.columns} 
                pagination={{defaultPageSize:TYPES.PAGE_SIZE}}
                ></Table>

                 <Modal
                title={ Object.keys(user).length===0?'添加用户':'更新用户'}
                visible={isShow}
                onOk={this.addOrUpdateUser}
                onCancel={()=>{
                    this.user={}
                    this.form.resetFields()
                    this.setState({isShow:false})
                }}
                >
                    <UserForm roles={roles} user={user}
                    setForm={form=>this.form=form}></UserForm>
                </Modal>
            </Card>
        )
    }
    componentWillMount(){
        this.initColums()
        
    }
    componentDidMount(){
        this.getUsers()
    }
}
