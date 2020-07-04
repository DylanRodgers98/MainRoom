import React from 'react';
import axios from 'axios';
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import './css/settings.scss';

const filters = require('./json/filters.json');

export default class StreamSettings extends React.Component {

    constructor(props) {
        super(props);

        this.getUserSettings = this.getUserSettings.bind(this);
        this.generateStreamKey = this.generateStreamKey.bind(this);
        this.genreDropdownToggle = this.genreDropdownToggle.bind(this);
        this.categoryDropdownToggle = this.categoryDropdownToggle.bind(this);
        this.setTitle = this.setTitle.bind(this);
        this.setGenre = this.setGenre.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.setTags = this.setTags.bind(this);
        this.saveSettings = this.saveSettings.bind(this);

        this.state = {
            genres: [],
            categories: [],
            genreDropdownOpen: false,
            categoryDropdownOpen: false,
            unsavedChanges: false,
            streamKey: '',
            streamTitle: '',
            streamGenre: '',
            streamCategory: '',
            streamTags: []
        };
    }

    componentDidMount() {
        this.getUserSettings();
        this.setState({
            genres: Array.from(filters.genres).sort(),
            categories: Array.from(filters.categories).sort()
        });
    }

    getUserSettings() {
        axios.get('/settings').then(res => {
            this.setState({
                streamKey: res.data.streamKey,
                streamTitle: res.data.streamTitle,
                streamGenre: res.data.streamGenre,
                streamCategory: res.data.streamCategory,
                streamTags: res.data.streamTags
            });
        });
    }

    generateStreamKey() {
        axios.post('/settings/streamKey').then(res => {
            this.setState({
                streamKey: res.data.streamKey
            });
        })
    }

    copyFrom(elementId) {
        document.getElementById(elementId).select();
        document.execCommand('copy');
    }

    genreDropdownToggle() {
        this.setState(prevState => ({
            genreDropdownOpen: !prevState.genreDropdownOpen
        }));
    }

    categoryDropdownToggle() {
        this.setState(prevState => ({
            categoryDropdownOpen: !prevState.categoryDropdownOpen
        }));
    }

    setTitle(event) {
        this.setState({
            streamTitle: event.target.value,
            unsavedChanges: true
        });
    }

    setGenre(event) {
        this.setState({
            streamGenre: event.currentTarget.textContent,
            unsavedChanges: true
        });
    }

    setCategory(event) {
        this.setState({
            streamCategory: event.currentTarget.textContent,
            unsavedChanges: true
        });
    }

    setTags(event) {
        const tags = event.target.value.replace(/\s/g, '').split(',');
        this.setState({
            streamTags: tags,
            unsavedChanges: true
        });
    }

    saveSettings() {
        axios.post('/settings', {
            streamTitle: this.state.streamTitle,
            streamGenre: this.state.streamGenre,
            streamCategory: this.state.streamCategory,
            streamTags: this.state.streamTags
        }).then(res => {
            this.setState({
                streamTitle: res.data.streamTitle,
                streamGenre: res.data.streamGenre,
                streamCategory: res.data.streamCategory,
                streamTags: res.data.streamTags,
                unsavedChanges: false
            })
        });
    }

    getGenreDropdownText() {
        return this.state.streamGenre || 'Select a genre...';
    }

    getCategoryDropdownText() {
        return this.state.streamCategory || 'Select a category...';
    }

    render() {
        const genres = this.state.genres.map((genre) => {
            return <DropdownItem onClick={this.setGenre}>{genre}</DropdownItem>
        });

        const categories = this.state.categories.map((category) => {
            return <DropdownItem onClick={this.setCategory}>{category}</DropdownItem>
        });

        return (
            <React.Fragment>
                <div className="container mt-5">
                    <h4>Stream Settings</h4>
                    <hr className="mt-4"/>
                    <i>Copy and paste the Server URL and Stream Key into your streaming software</i>
                    <table className="mt-3">
                        <tr>
                            <td>
                                <h5 className="mr-3">Server URL:</h5>
                            </td>
                            <table>
                                <tr>
                                    <td>
                                        <input id="serverUrlInput" type="text" value="rtmp://127.0.0.1:1935/live"/>
                                    </td>
                                    <td>
                                        <Button className="btn btn-dark ml-1" size="sm"
                                                onClick={() => this.copyFrom('serverUrlInput')}>
                                            Copy
                                        </Button>
                                    </td>
                                </tr>
                            </table>
                        </tr>
                        <tr>
                            <td>
                                <h5 className="mt-2 mr-3">Stream Key:</h5>
                            </td>
                            <table>
                                <tr>
                                    <td>
                                        <input id="streamKeyInput" className="mt-2" type="text"
                                               value={this.state.streamKey}/>
                                    </td>
                                    <td>
                                        <Button className="btn btn-dark mt-2 ml-1" size="sm"
                                                onClick={() => this.copyFrom('streamKeyInput')}>
                                            Copy
                                        </Button>
                                        <Button className="btn btn-dark mt-2 ml-1" size="sm"
                                                onClick={this.generateStreamKey}>
                                            Generate a new key
                                        </Button>
                                    </td>
                                </tr>
                            </table>
                        </tr>
                        <tr>
                            <td>
                                <h5 className="mt-2">Title:</h5>
                            </td>
                            <td>
                                <input className="settings-title" type="text" value={this.state.streamTitle}
                                       onChange={this.setTitle}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h5 className="mt-2">Genre:</h5>
                            </td>
                            <td>
                                <Dropdown className="settings-dropdown" isOpen={this.state.genreDropdownOpen}
                                          toggle={this.genreDropdownToggle} size="sm">
                                    <DropdownToggle caret>{this.getGenreDropdownText()}</DropdownToggle>
                                    <DropdownMenu>{genres}</DropdownMenu>
                                </Dropdown>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h5 className="mt-2">Category:</h5>
                            </td>
                            <td>
                                <Dropdown className="settings-dropdown" isOpen={this.state.categoryDropdownOpen}
                                          toggle={this.categoryDropdownToggle} size="sm">
                                    <DropdownToggle caret>{this.getCategoryDropdownText()}</DropdownToggle>
                                    <DropdownMenu>{categories}</DropdownMenu>
                                </Dropdown>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h5 className="mt-2">Tags:</h5>
                            </td>
                            <table>
                                <tr>
                                    <td>
                                        <input className="mt-1" type="text" value={this.state.streamTags}
                                               onChange={this.setTags}/>
                                    </td>
                                    <td>
                                        <i className="ml-1">Comma-separated</i>
                                    </td>
                                </tr>
                            </table>
                        </tr>
                    </table>
                    <hr className="my-4"/>
                    <div className="float-right">
                        <Button className="btn btn-dark" size="lg" disabled={!this.state.unsavedChanges}
                                onClick={this.saveSettings}>
                            Save Settings
                        </Button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}