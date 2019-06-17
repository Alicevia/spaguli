import React, { Component } from 'react'
import './LinkButton.less'
export default function LinkButton(props){
    return <button {...props} className='link-button'>{props.children}</button>
}
