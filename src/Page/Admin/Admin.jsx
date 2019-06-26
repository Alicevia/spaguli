import React, { Component } from 'react'
import memoryUtils from '../../utils/memoryUtils'
import {Redirect,Switch,Route} from 'react-router-dom'
import { Layout } from 'antd';
import './Admin.less'
import LeftNav from '../../Components/LeftNav/LeftNav' 
import Header from '../../Components/Header/Header'
import Home from '../Home/Home'
import Category from '../Category/Category'
import User from '../User/User'
import Role from '../Role/Role'
import Product from '../Product/Product'
import Pie from '../Charts/Pie'
import Line from '../Charts/Line'
import Bar from '../Charts/Bar'

const {  Footer, Sider, Content } = Layout;
class Admin extends Component {
 constructor(props,context){
  super(props,context)
 }
 render() {
     let user = memoryUtils.user
     if (!user||!user._id) {
         return <Redirect to='/login'></Redirect>
     }
  return (
        <Layout style={{minHeight:'100%'}}>
            <Sider>
                <LeftNav></LeftNav>
            </Sider>
            <Layout className='container'>
                <Header></Header>
                <Content className='main' >
                    <Switch>
                        <Route path='/home' component={Home}></Route>
                        <Route path='/product' component={Product}></Route>
                        <Route path='/user' component={User}></Route>
                        <Route path='/category' component={Category}></Route>
                        <Route path='/role' component={Role}></Route>
                        <Route path='/charts/bar' component={Bar}></Route>
                        <Route path='/charts/line' component={Line}></Route>
                        <Route path='/charts/pie' component={Pie}></Route>
                        <Redirect from='/' to='/home' ></Redirect>
                    </Switch>
                </Content>
                <Footer>Footer</Footer>
            </Layout>
        </Layout>

    )
 }
}
export default Admin;