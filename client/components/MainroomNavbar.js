import React from 'react';
import {Link} from 'react-router-dom';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Button, Navbar, NavbarBrand, Nav, NavItem, NavLink, Collapse, NavbarToggler} from 'reactstrap';
import config from '../../mainroom.config';
import axios from 'axios';

export default class MainroomNavbar extends React.Component {

    constructor(props) {
        super(props);

        this.genreDropdownToggle = this.genreDropdownToggle.bind(this);
        this.onMouseEnterGenreDropdown = this.onMouseEnterGenreDropdown.bind(this);
        this.onMouseLeaveGenreDropdown = this.onMouseLeaveGenreDropdown.bind(this);
        this.categoryDropdownToggle = this.categoryDropdownToggle.bind(this);
        this.onMouseEnterCategoryDropdown = this.onMouseEnterCategoryDropdown.bind(this);
        this.onMouseLeaveCategoryDropdown = this.onMouseLeaveCategoryDropdown.bind(this);
        this.onSearchTextChange = this.onSearchTextChange.bind(this);
        this.searchHandleKeyDown = this.searchHandleKeyDown.bind(this);
        this.clearSearchBox = this.clearSearchBox.bind(this);
        this.profileDropdownToggle = this.profileDropdownToggle.bind(this);
        this.navbarToggle = this.navbarToggle.bind(this);

        this.state = {
            genreDropdownOpen: false,
            genres: [],
            categoryDropdownOpen: false,
            categories: [],
            searchText: '',
            searchSubmitted: false,
            profileDropdownOpen: false,
            loggedInUser: '',
            profilePicURL: '',
            navbarOpen: false
        };
    }

    componentDidMount() {
        this.getLoggedInUser();
        this.getFilters();
    }

    async getLoggedInUser() {
        const res = await axios.get('/logged-in-user');
        if (res.data.username) {
            this.setState({
                loggedInUser: res.data.username,
                loggedInUserId: res.data._id
            }, () => {
                this.getProfilePicURL();
            });
        }
    }

    async getProfilePicURL() {
        const res = await axios.get(`/api/users/${this.state.loggedInUserId}/profile-pic`);
        this.setState({
            profilePicURL: res.data.profilePicURL
        });
    }

    async getFilters() {
        const res = await axios.get('/api/filters');
        this.setState({
            genres: res.data.genres,
            categories: res.data.categories
        });
    }


    genreDropdownToggle() {
        this.setState(prevState => ({
            genreDropdownOpen: !prevState.genreDropdownOpen
        }));
    }

    onMouseEnterGenreDropdown() {
        this.setState({
            genreDropdownOpen: true
        });
    }

    onMouseLeaveGenreDropdown() {
        this.setState({
            genreDropdownOpen: false
        });
    }

    categoryDropdownToggle() {
        this.setState(prevState => ({
            categoryDropdownOpen: !prevState.categoryDropdownOpen
        }));
    }

    onMouseEnterCategoryDropdown() {
        this.setState({
            categoryDropdownOpen: true
        });
    }

    onMouseLeaveCategoryDropdown() {
        this.setState({
            categoryDropdownOpen: false
        });
    }

    onSearchTextChange(e) {
        this.setState({
            searchText: e.target.value
        });
    }

    searchHandleKeyDown(e) {
        if (e.key === 'Enter' && this.state.searchText) {
            document.getElementById('searchButton').click();
            document.getElementById('searchBox').blur();
        }
    }

    clearSearchBox() {
        this.setState({
            searchText: ''
        });
    }

    getRedirectablePath(pathname) {
        return pathname + (window.location.pathname === '/' ? '' : `?redirectTo=${window.location.pathname}`);
    }

    renderLogInOrProfileDropdown() {
        return this.state.loggedInUser ? (
            <Nav navbar>
                <NavItem>
                    <Dropdown className='navbar-menu navbar-dropdown text-center' nav inNavbar
                              isOpen={this.state.profileDropdownOpen} toggle={this.profileDropdownToggle}>
                        <DropdownToggle caret>
                            <img className='rounded-circle' src={this.state.profilePicURL} width='25' height='25'
                                 alt='Menu'/>
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem tag={Link} to={`/user/${this.state.loggedInUser}`}>Profile</DropdownItem>
                            <DropdownItem tag={Link} to={'/schedule'}>Schedule</DropdownItem>
                            <DropdownItem tag={Link}
                                          to={`/user/${this.state.loggedInUser}/subscriptions`}>Subscriptions</DropdownItem>
                            <DropdownItem divider/>
                            <DropdownItem tag={Link} to={'/go-live'}>Go Live</DropdownItem>
                            <DropdownItem tag={Link} to={'/settings'}>Settings</DropdownItem>
                            <DropdownItem divider/>
                            <DropdownItem href={'/logout'}>Log Out</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavItem>
            </Nav>
        ) : (
            <Nav navbar>
                <NavItem>
                    <NavLink href={this.getRedirectablePath('/login')}
                             className='text-center text-nowrap'>Log In</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href={this.getRedirectablePath('/register')}
                             className='text-center'>Register</NavLink>
                </NavItem>
            </Nav>
        );
    }

    profileDropdownToggle() {
        this.setState(prevState => ({
            profileDropdownOpen: !prevState.profileDropdownOpen
        }));
    }

    navbarToggle() {
        this.setState(prevState => ({
            navbarOpen: !prevState.navbarOpen
        }));
    }

    render() {
        const genres = this.state.genres.map((genre, index) => {
            const link = encodeURIComponent(genre.trim());
            return (
                <div key={index}>
                    <DropdownItem tag={Link} to={`/genre/${link}`}>{genre}</DropdownItem>
                </div>
            );
        })

        const categories = this.state.categories.map((category, index) => {
            const link = encodeURIComponent(category.trim());
            return (
                <div key={index}>
                    <DropdownItem tag={Link} to={`/category/${link}`}>{category}</DropdownItem>
                </div>
            );
        })

        const searchButtonLink = this.state.searchText ? `/search/${this.state.searchText}` : '';

        return (
            <Navbar color='dark' dark expand='md'>
                <NavbarBrand tag={Link} to={'/'}>{config.siteTitle}</NavbarBrand>
                <NavbarToggler onClick={this.navbarToggle} />
                <Collapse isOpen={this.state.navbarOpen} navbar>
                <Nav className='mr-auto' navbar>
                    <NavItem>
                        <Dropdown className='navbar-dropdown navbar-menu text-center' nav inNavbar
                            onMouseOver={this.onMouseEnterGenreDropdown} onMouseLeave={this.onMouseLeaveGenreDropdown}
                            isOpen={this.state.genreDropdownOpen}
                            toggle={this.genreDropdownToggle}>
                            <DropdownToggle caret>Genre</DropdownToggle>
                            <DropdownMenu>{genres}</DropdownMenu>
                        </Dropdown>
                    </NavItem>
                    <NavItem>
                        <Dropdown className='navbar-dropdown navbar-menu text-center' nav inNavbar
                                  onMouseOver={this.onMouseEnterCategoryDropdown}
                                  onMouseLeave={this.onMouseLeaveCategoryDropdown}
                                  isOpen={this.state.categoryDropdownOpen} toggle={this.categoryDropdownToggle}>
                            <DropdownToggle caret>Category</DropdownToggle>
                            <DropdownMenu>{categories}</DropdownMenu>
                        </Dropdown>
                    </NavItem>
                    <NavItem>
                        <input id='searchBox' className='form-control' placeholder='Search...'
                               onChange={this.onSearchTextChange} onKeyDown={this.searchHandleKeyDown}
                              value={this.state.searchText}/>
                    </NavItem>
                    <NavItem>
                        <Button id='searchButton' className='form-control' onClick={this.clearSearchBox}
                                tag={Link} to={searchButtonLink}>
                            Search
                        </Button>
                    </NavItem>
                    </Nav>
                    {this.renderLogInOrProfileDropdown()}
                </Collapse>
            </Navbar>
        );
    }
}