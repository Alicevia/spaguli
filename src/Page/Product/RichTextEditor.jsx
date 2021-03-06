import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { EditorState, convertToRaw,ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default class RichTextEditor extends Component {
    static propTypes = {
        detail:PropTypes.string
    }
  
    constructor(props){
        super(props)
        const html = this.props.detail;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const editorState = EditorState.createWithContent(contentState);
          this.state = {
            editorState,
          };
        }else {
            this.state={
                editorState: EditorState.createEmpty(),
                  
            }
        }
    }

    
      onEditorStateChange = (editorState) => {
        this.setState({
          editorState,
        });
      };
      getDetail=()=>{
          return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
      }
      uploadImageCallBack(file) {
        return new Promise(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/manage/img/upload');
            const data = new FormData();
            data.append('image', file);
            xhr.send(data);
            xhr.addEventListener('load', () => {
              const response = JSON.parse(xhr.responseText);
              resolve({data:{link :response.data.url}});
            });
            xhr.addEventListener('error', () => {
              const error = JSON.parse(xhr.responseText);
              reject(error);
            });
          }
        );
      }
      

    
      render() {
        const { editorState } = this.state;
        return (
          <div>
            <Editor
              editorState={editorState}
              editorStyle={{border:'1px solid #999',minHeight:'200px',padding:10,lineHeight:'20px'}}
              onEditorStateChange={this.onEditorStateChange}
              toolbar={{
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: true },
                image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
              }}
            />
      
          </div>
        );
      }
}