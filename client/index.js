import React from "react";
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import 'bootstrap';
import Root from './Root.js';
import config from '../server/config/default';
import './css/index.scss';

document.title = config.headTitle;

if (document.getElementById('root')) {
    ReactDOM.render(
        <BrowserRouter>
            <Root/>
        </BrowserRouter>,
        document.getElementById('root')
    );
}