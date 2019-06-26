import React, { Component } from 'react'
import { Upload, Icon, Modal,message } from 'antd'
import {reqDeleteImg} from '../../api/index'
import PropTypes from 'prop-types'
import {BASE_IMG_URL} from '../../utils/constants'

function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }


export default class PicturesWall extends Component {
    static propTypes = {
        imgs:PropTypes.array
    }
    constructor(props){
        super(props)
        let fileList=[]
        let {imgs} = this.props;
        if (imgs && imgs.length>0) {
            fileList = imgs.map((item,index)=>{
                return {
                    uid:-index,
                    name:item,
                    status:'done',
                    url:BASE_IMG_URL+item
                }
            })
        }
        this.state={
            previewVisible: false,//是否显示大图预览
            previewImage: '',
            fileList
        }
    }
    state = {
       
        fileList: [],
      };
    
      handleCancel = () => this.setState({ previewVisible: false });
    
      handlePreview = async file => {
        //   显示指定file对应的大图
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
    
        this.setState({
          previewImage: file.url || file.preview,
          previewVisible: true,
        });
      };
      //所有已经上传图片文件的数组 file表示当前操作的图片
      handleChange =async ({ file,fileList }) =>{
          console.log(file)
          if (file.status==='done') {
              let result = file.response//{status:0,data}
              if (result.status===0) {
                  message.success('图片上传成功')
                  let {name,url} = result.data
                  file = fileList[fileList.length-1]
                  file.name = name
                  file.url = url
              }else{
                  message.error('上传图片失败')
              }
          }else if(file.status==='removed'){
            let result = await reqDeleteImg(file.name)
            console.log(result)
            if (result.status===0) {
                message.success('删除图片成功')
            }else{
                message.error('删除图片失败')
            }
          }
          this.setState({fileList})

      };
      getImgs=()=>{
          return this.state.fileList.map(item=>{
              return item.name
          })
      }
    
      render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
          </div>
        );
        return (
          <div>
            <Upload
              action="/manage/img/upload"//图片的上传接口
              accept={'image/*'}//只接受图片格式
              name={'image'}//请求参数名
              listType="picture-card"//预览图片的样式
              fileList={fileList}//所有已上传图片的数组
              onPreview={this.handlePreview}
              onChange={this.handleChange}
            >
              {fileList.length >= 3 ? null : uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
            </div>
    );
  }
}
