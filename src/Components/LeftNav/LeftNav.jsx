import React, { Component } from 'react'
import './LeftNav.less'
import {Link,withRouter} from 'react-router-dom'
import { Menu, Icon, Button } from 'antd';
import menuList from '../../config/menuConfig' 
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
                    if (this.props.location.pathname===v.key) {
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
        this.menuNodes = this.renderItem(menuList)
    }


    render() {
        let path = this.props.location.pathname
        
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