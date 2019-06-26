import React, { Component } from 'react'
import './LeftNav.less'
import {Link,withRouter} from 'react-router-dom'
import { Menu, Icon, Button } from 'antd';
import menuList from '../../config/menuConfig' 
import memoryUtils from '../../utils/memoryUtils'
const { SubMenu }  = Menu

 class LeftNav extends Component {
    // state = {
    //     collapsed: true,
    //   };
    
    // toggleCollapsed = () => {
    //     this.setState({
    //         collapsed: !this.state.collapsed,
    //     });
    // };
    hasAuth=(item)=>{
        let {key,isPublic} = item
        let menus = memoryUtils.user.role.menus
        let username = memoryUtils.user.username
        if (username==='admin'||isPublic||menus.indexOf(key)>-1) {
            return true
        }else if(item.children){
            return !!item.children.find(child=>menus.indexOf(child.key)>-1)
        }
        return false
    }
    getMenuNodes = (menuList)=>{
        let path = this.props.location.pathname
        return menuList.reduce((pre,item)=>{
            if (this.hasAuth(item)) {
                if (!item.children) {
                    pre.push((
                        <Menu.Item key={item.key}>
                        <Link to={item.key}>
                          <Icon type={item.icon}/>
                          <span>{item.title}</span>
                        </Link>
                      </Menu.Item>
                    ))
                }else {
                    let cItem = item.children.find(cItem=>path.indexOf(cItem.key)>-1)
                    if (cItem) {
                        this.flag = item.key
                    }
                    pre.push((
                        <SubMenu
                        key={item.key}
                        title={
                          <span>
                        <Icon type={item.icon}/>
                        <span>{item.title}</span>
                      </span>
                        }
                      >
                        {this.getMenuNodes(item.children)}
                      </SubMenu>    
                    ))
                }
            }
            return pre
        },[])
    }


    renderItem(menuList){
       return menuList.map((item,index)=>{
            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>                 
                    </Menu.Item>
                )
            }else {
               item.children.forEach(v=>{
                    if (this.props.location.pathname===v.key||this.props.location.pathname.indexOf(v.key)===0) {
                        this.flag = item.key
                    }
                })
                return (
                    <SubMenu
                        key={item.key}
                        title={
                        <span>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </span>
                        }
                    >
                        {this.renderItem(item.children)}
                    </SubMenu>
                )
            }
        })
    }
    componentWillMount(){
        // this.menuNodes = this.renderItem(menuList)
        this.menuNodes = this.getMenuNodes(menuList)
    }


    render() {
        let path = this.props.location.pathname
        if (path.indexOf('/product')>-1) {
            path = '/product'
        }
        
        return (
            <div className='left-nav'>
                <Link to='/' className="left-nav-header">
                    <img src={require('../../assets/images/logo.png')} alt=""/>
                    <h1>Alicevia</h1>
                </Link>
                <div>               
                    <Menu
                    selectedKeys={[path]}
                    defaultSelectedKeys={['/home']}
                    defaultOpenKeys={[this.flag]}
                    mode="inline"
                    theme="dark"
                    
                    // inlineCollapsed={this.state.collapsed}
                    >
                   {this.menuNodes}
                    </Menu>
                </div>
            </div>
        )
    }
}

export default withRouter(LeftNav)