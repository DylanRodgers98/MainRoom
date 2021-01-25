import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import config from '../../mainroom.config';
import {Button, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row} from 'reactstrap';
import {shortenNumber} from '../utils/numberUtils';
import {displayGenreAndCategory} from '../utils/displayUtils';

const STARTING_PAGE = 1;

export default class LiveStreamsByCategory extends React.Component {

    constructor(props) {
        super(props);

        this.categoryDropdownToggle = this.categoryDropdownToggle.bind(this);
        this.setCategoryFilter = this.setCategoryFilter.bind(this);
        this.clearCategoryFilter = this.clearCategoryFilter.bind(this);

        this.state = {
            loaded: false,
            liveStreams: [],
            nextPage: STARTING_PAGE,
            categories: [],
            categoryDropdownOpen: false,
            categoryFilter: '',
            showLoadMoreButton: false
        }
    }

    componentDidMount() {
        this.getLiveStreams();
        this.getFilters();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.genre !== this.props.match.params.genre) {
            this.setState({
                loaded: false,
                liveStreams: [],
                nextPage: STARTING_PAGE,
                categoryFilter: ''
            }, async () => {
                await this.getLiveStreams();
            });
        } else if (prevState.categoryFilter !== this.state.categoryFilter) {
            this.setState({
                loaded: false,
                liveStreams: [],
                nextPage: STARTING_PAGE
            }, async () => {
                await this.getLiveStreams();
            });
        }
    }

    async getLiveStreams() {
        const queryParams = {
            params: {
                page: this.state.nextPage,
                limit: config.pagination.large
            }
        };
        if (this.props.match.params.genre) {
            queryParams.params.genre = decodeURIComponent(this.props.match.params.genre);
        }
        if (this.state.categoryFilter) {
            queryParams.params.category = this.state.categoryFilter;
        }

        const res = await axios.get('/api/livestreams', queryParams);
        this.setState({
            liveStreams: [...this.state.liveStreams, ...(res.data.streams || [])],
            nextPage: res.data.nextPage,
            showLoadMoreButton: !!res.data.nextPage,
            loaded: true
        });
    }

    async getFilters() {
        const res = await axios.get('/api/filters/categories');
        this.setState({
            categories: res.data.categories
        })
    }

    categoryDropdownToggle() {
        this.setState(prevState => ({
            categoryDropdownOpen: !prevState.categoryDropdownOpen
        }));
    }

    setCategoryFilter(event) {
        this.setState({
            categoryFilter: event.currentTarget.textContent
        });
    }

    clearCategoryFilter() {
        this.setState({
            categoryFilter: ''
        });
    }

    render() {
        const streams = this.state.liveStreams.map((liveStream, index) => (
            <Col className='stream margin-bottom-thick' key={index}>
                <span className='live-label'>LIVE</span>
                <span className='view-count'>
                    {shortenNumber(liveStream.viewCount)} viewer{liveStream.viewCount === 1 ? '' : 's'}
                </span>
                <Link to={`/user/${liveStream.username}/live`}>
                    <img className='w-100' src={liveStream.thumbnailURL}
                         alt={`${liveStream.username} Stream Thumbnail`}/>
                </Link>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <Link to={`/user/${liveStream.username}`}>
                                    <img className='rounded-circle m-2' src={liveStream.profilePicURL}
                                         width='50' height='50'
                                         alt={`${liveStream.username} profile picture`}/>
                                </Link>
                            </td>
                            <td valign='middle' className='w-100'>
                                <h5>
                                    <Link to={`/user/${liveStream.username}`}>
                                        {liveStream.displayName || liveStream.username}
                                    </Link>
                                    <span className='black-link'>
                                        <Link to={`/user/${liveStream.username}/live`}>
                                            {liveStream.title ? ` - ${liveStream.title}` : ''}
                                        </Link>
                                    </span>
                                </h5>
                                <h6>
                                    {displayGenreAndCategory({
                                        genre: liveStream.genre,
                                        category: liveStream.category
                                    })}
                                </h6>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Col>
        ));

        const streamBoxes = streams.length ? (
            <Row xs='1' sm='1' md='2' lg='3' xl='3'>
                {streams}
            </Row>
        ) : (
            <p className='my-4 text-center'>
                No one matching your search is live right now :(
            </p>
        );

        const pageHeader = `${decodeURIComponent(this.props.match.params.genre)} Livestreams`;

        const categoryDropdownText = this.state.categoryFilter || 'Filter';

        const categories = this.state.categories.map((category, index) => (
            <div key={index}>
                <DropdownItem onClick={this.setCategoryFilter}>{category}</DropdownItem>
            </div>
        ));

        const loadMoreButton = !this.state.showLoadMoreButton ? undefined : (
            <div className='text-center my-4'>
                <Button className='btn-dark' onClick={async () => await this.getLiveStreams()}>
                    Load More
                </Button>
            </div>
        );

        return (
            <Container fluid='lg' className='mt-5'>
                <Row>
                    <Col>
                        <h4>{pageHeader}</h4>
                    </Col>
                    <Col>
                        <Dropdown className='dropdown-hover-darkred float-right' isOpen={this.state.categoryDropdownOpen}
                                  toggle={this.categoryDropdownToggle} size='sm'>
                            <DropdownToggle caret>{categoryDropdownText}</DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem onClick={this.clearCategoryFilter} disabled={!this.state.categoryFilter}>
                                    Clear Filter
                                </DropdownItem>
                                <DropdownItem divider/>
                                {categories}
                            </DropdownMenu>
                        </Dropdown>
                    </Col>
                </Row>
                <hr className='my-4'/>
                {!this.state.loaded ? <h1 className='text-center mt-5'>Loading...</h1> : (
                    <React.Fragment>
                        {streamBoxes}
                        {loadMoreButton}
                    </React.Fragment>
                )}
            </Container>
        );
    }
}