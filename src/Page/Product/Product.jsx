import React, { Component } from 'react'
import {Switch,Route} from 'react-router-dom'
import ProductHome from './ProductHome';
import ProductDetail from './ProductDetail';
import './Product.less'
import {Redirect} from 'react-router-dom'
import ProductUpdate from './ProductUpdate';
export default class Product extends Component {
    render() {
        return (
            <Switch>
                <Route path='/product' exact component={ProductHome}></Route>
                <Route path='/product/detail' component={ProductDetail}></Route>
                <Route path='/product/addupdate' component={ProductUpdate}></Route>

                <Redirect to='/product'></Redirect>
            </Switch>
        )
    }
}
