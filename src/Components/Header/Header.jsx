import React, { Component } from 'react'
import './Header.less'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils'
import {reqWeather} from '../../api/index'
import {withRouter} from 'react-router-dom'
import menuList from '../../config/menuConfig'
import {Modal} from 'antd'
import LinkButton from '../../Components/LinkButton/LinkButton'

const confirm = Modal.confirm;

 class Header extends Component {
    state={
        currentTime:formateDate(),
        dayPictureUrl:'',
        weather:''
    }
    componentDidMount(){
        this.getTime()
        this.getWeather()
    }
    componentWillUnmount(){
        clearInterval(this.timer)
    }
    getTime(){
        this.timer = setInterval(()=>{
            let currentTime = formateDate()
            this.setState({currentTime})
        },1000)
    }
    async getWeather(){
        let {dayPictureUrl,weather} = await reqWeather('淮安');
        this.setState({
            dayPictureUrl,
            weather
        })
    }
    getTitle(){
        let path = this.props.location.pathname
        let title;
        menuList.forEach(item=>{
           if (path.indexOf(item.key)>-1) {
               title=item.title
               return;
           }
           if (item.children) {
               item.children.forEach(v=>{
                   if (path.indexOf(v.key)>-1) {
                       title=v.title
                       return
                   }
               })
           }
        })
        return title
    }
    logout=()=>{
        confirm({
            title: '你确定要退出吗?',
            onOk:()=> {
              storageUtils.removeUser()
              memoryUtils.user={}
              this.props.history.replace('/login')
        
            },
          });
    }

    render() {
        let {currentTime,dayPictureUrl,weather} = this.state;
        let user = memoryUtils.user.username
        return (
            <div className='header'>
                <div className="header-top">
                    <span>欢迎，{user}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className='header-bottom-left'>{this.getTitle()}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt=""/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)