import ajax from './ajax'
import jsonp from 'jsonp'
import {message} from 'antd'

const BASE = ''
export const reqLoign = (username,password)=> ajax(BASE+'/login',{username,password},'POST')

// 获取用户信息
export const reqUsers = ()=>ajax(BASE+'/manage/user/list')
// 删除用户
export const reqDeleteUser=(userId)=>ajax(BASE+'/manage/user/delete',{userId},'POST')

export const reqAddOrUpdateUser=(data)=>ajax(BASE+'/manage/user/'+(data._id?'update':'add'),data,'POST')
// export const reqAddOrUpdateProduct = (product)=>ajax(BASE + '/manage/product/'+(product._id?'update':'add'), product, 'POST')

// 获取一级二级分类的列表
export const reqCategory = (parentId)=> ajax(BASE+'/manage/category/list',{parentId})
// 添加分类
export const reqAddCategory = (parentId,categoryName)=> ajax(BASE+'/manage/category/add',{parentId,categoryName},'POST')

// 更新分类
export const reqUpdateCategory = (categoryId,categoryName)=> ajax(BASE+'/manage/category/update',{categoryId,categoryName},'POST')
//根据id获取name
export const reqCategoryNameById= (categoryId)=>ajax(BASE+'/manage/category/info?',{categoryId})

// 获取商品分页列表
export const reqProducts = (pageNum,pageSize)=> ajax(BASE+'/manage/product/list',{pageNum,pageSize})

// 搜索商品分页列表
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType})=>ajax(BASE+'/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]:searchName
})

// 商品的上架与下架
export const reqUpdateStatus = (productId,status)=>ajax(BASE+'/manage/product/updateStatus',{productId,status},'POST')

export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')


export const reqAddOrUpdateProduct = (product)=>ajax(BASE + '/manage/product/'+(product._id?'update':'add'), product, 'POST')


export const reqRoles = ()=>ajax(BASE+'/manage/role/list')

export const reqAddRole = (roleName)=>ajax(BASE+'/manage/role/add',{roleName},'POST')

export const reqUpdateRole = (data)=>ajax(BASE+'/manage/role/update',data,'POST')

export const reqWeather = (city)=>{
    return new Promise((resolve,reject)=>{
        let url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        jsonp(url,{},(err,data)=>{
            if (!err && data.status==='success') {
                let {dayPictureUrl,weather} = data.results[0].weather_data[0]
                resolve({dayPictureUrl,weather})
            }else {
                message.error('获取天气信息失败')
            }
        })
    })
}
