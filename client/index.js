import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import 'regenerator-runtime/runtime';
import config from '../mainroom.config';
import Navbar from './components/Navbar';
import Home from './components/Home';
import LiveStreamsByGenre from './components/LiveStreamsByGenre';
import LiveStreamsByCategory from './components/LiveStreamsByCategory';
import Search from './components/Search';
import UserProfile from './components/UserProfile';
import Subscribers from './components/Subscribers';
import Subscriptions from './components/Subscriptions';
import UserStream from './components/UserStream';
import Schedule from './components/Schedule';
import GoLive from './components/GoLive';
import Settings from './components/Settings';
import FourOhFour from './components/FourOhFour';
import './mainroom.scss';

document.title = config.headTitle;

if (document.getElementById('root')) {
    ReactDOM.render(
        <BrowserRouter>
            <React.Fragment>
                <Navbar/>
                <Switch>
                    <Route exact path='/' render={props => (
                        <Home {...props} />
                    )}/>

                    <Route exact path='/genre/:genre' render={props => (
                        <LiveStreamsByGenre {...props} />
                    )}/>

                    <Route exact path='/category/:category' render={props => (
                        <LiveStreamsByCategory {...props} />
                    )}/>

                    <Route exact path='/search/:query' render={props => (
                        <Search {...props} />
                    )}/>

                    <Route exact path='/user/:username' render={props => (
                        <UserProfile {...props} />
                    )}/>

                    <Route exact path='/user/:username/subscribers' render={props => (
                        <Subscribers {...props} />
                    )}/>

                    <Route exact path='/user/:username/subscriptions' render={props => (
                        <Subscriptions {...props} />
                    )}/>

                    <Route exact path='/user/:username/live' render={props => (
                        <UserStream {...props} />
                    )}/>

                    <Route exact path='/schedule' render={props => (
                        <Schedule {...props} />
                    )}/>

                    <Route exact path='/settings' render={props => (
                        <Settings {...props} />
                    )}/>

                    <Route exact path='/go-live' render={props => (
                        <GoLive {...props} />
                    )}/>

                    {/* matches none -> 404 */}
                    <Route component={FourOhFour}/>
                </Switch>
            </React.Fragment>
        </BrowserRouter>,
        document.getElementById('root')
    );
}