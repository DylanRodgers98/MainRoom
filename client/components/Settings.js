import React from "react";
import axios from 'axios';
import Container from "reactstrap/es/Container";
import {Button} from "reactstrap";
import {Modal} from "react-bootstrap";

export default class Settings extends React.Component {

    constructor(props) {
        super(props);

        this.setUsername = this.setUsername.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setCurrentPassword = this.setCurrentPassword.bind(this);
        this.setNewPassword = this.setNewPassword.bind(this);
        this.setConfirmNewPassword = this.setConfirmNewPassword.bind(this);
        this.saveSettings = this.saveSettings.bind(this);
        this.resetPasswordToggle = this.resetPasswordToggle.bind(this);
        this.resetPassword = this.resetPassword.bind(this);

        this.state = {
            loggedInUserId: '',
            loaded: false,
            startingUsername: '',
            username: '',
            startingEmail: '',
            email: '',
            usernameInvalidReason: '',
            emailInvalidReason: '',
            resetPasswordOpen: false,
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            currentPasswordInvalidReason: '',
            newPasswordInvalidReason: '',
            confirmNewPasswordInvalidReason: ''
        }
    }

    componentDidMount() {
        this.fillComponentIfLoggedIn();
    }

    async fillComponentIfLoggedIn() {
        const res = await axios.get('/api/users/logged-in');
        if (res.data.username) {
            this.setState({
                loggedInUserId: res.data._id
            }, () => {
                this.getUsernameAndEmail();
            });
        } else {
            window.location.href = `/login?redirectTo=${window.location.pathname}`;
        }
    }

    async getUsernameAndEmail() {
        const res = await axios.get(`/api/users/${this.state.loggedInUserId}/settings`);
        this.setState({
            startingUsername: res.data.username,
            username: res.data.username,
            startingEmail: res.data.email,
            email: res.data.email,
            loaded: true
        });
    }

    setUsername(event) {
        this.setState({
            username: event.target.value
        });
    }

    setEmail(event) {
        this.setState({
            email: event.target.value
        });
    }

    enableSaveButton() {
        return this.isUsernameChanged() || this.isEmailChanged();
    }

    isUsernameChanged() {
        return this.state.username !== this.state.startingUsername;
    }

    isEmailChanged() {
        return this.state.email !== this.state.startingEmail;
    }

    async saveSettings() {
        const data = {};
        if (this.isUsernameChanged()) {
            data.username = this.state.username;
        }
        if (this.isEmailChanged()) {
            data.email = this.state.email;
        }
        const res = await axios.patch(`/api/users/${this.state.loggedInUserId}/settings`, data);
        this.setState({
            usernameInvalidReason: res.data.usernameInvalidReason || '',
            emailInvalidReason: res.data.emailInvalidReason || ''
        });
        if (!(res.data.usernameInvalidReason || res.data.emailInvalidReason)) {
            this.setState({
                startingUsername: this.state.username,
                startingEmail: this.state.email
            });
        }
    }

    setCurrentPassword(event) {
        this.setState({
            currentPassword: event.target.value
        });
    }

    setNewPassword(event) {
        this.setState({
            newPassword: event.target.value
        });
    }

    setConfirmNewPassword(event) {
        this.setState({
            confirmNewPassword: event.target.value
        });
    }

    resetPasswordToggle() {
        this.setState(prevState => ({
            resetPasswordOpen: !prevState.resetPasswordOpen,
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        }));
    }

    async resetPassword() {
        const res = await axios.patch(`/api/users/${this.state.loggedInUserId}/password`, {
            currentPassword: this.state.currentPassword,
            newPassword: this.state.newPassword,
            confirmNewPassword: this.state.confirmNewPassword
        });
        this.setState({
            currentPasswordInvalidReason: res.data.currentPasswordInvalidReason || '',
            newPasswordInvalidReason: res.data.newPasswordInvalidReason || '',
            confirmNewPasswordInvalidReason: res.data.confirmNewPasswordInvalidReason || ''
        });
        if (!(this.state.currentPasswordInvalidReason
            || this.state.newPasswordInvalidReason
            || this.state.confirmNewPasswordInvalidReason)) {
            this.resetPasswordToggle();
        }
    }

    getNewPasswordInvalidReason() {
        return typeof this.state.newPasswordInvalidReason === 'string' ? this.state.newPasswordInvalidReason
            : this.state.newPasswordInvalidReason.map(line => <div>{line}<br/></div>);
    }

    enableResetPasswordButton() {
        return this.state.currentPassword && this.state.newPassword && this.state.confirmNewPassword;
    }

    renderResetPassword() {
        return (
            <Modal show={this.state.resetPasswordOpen} onHide={this.resetPasswordToggle} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table>
                        <tr>
                            <td>
                                <h6 className='mr-3'>Current Password:</h6>
                            </td>
                            <td>
                                <input className='rounded-border' type='password' value={this.state.currentPassword}
                                       onChange={this.setCurrentPassword}/>
                            </td>
                            <td>
                                <div className='ml-1'>
                                    {this.state.currentPasswordInvalidReason}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td valign='top'>
                                <h6 className='mt-1 mr-3'>New Password:</h6>
                            </td>
                            <td valign='top'>
                                <input className='mt-1 rounded-border' type='password' value={this.state.newPassword}
                                       onChange={this.setNewPassword}/>
                            </td>
                            <td>
                                <div className='ml-1'>
                                    {this.getNewPasswordInvalidReason()}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h6 className='mt-1 mr-3'>Confirm New Password:</h6>
                            </td>
                            <td>
                                <input className='mt-1 rounded-border' type='password'
                                       value={this.state.confirmNewPassword} onChange={this.setConfirmNewPassword}/>
                            </td>
                            <td>
                                <div className='ml-1'>
                                    {this.state.confirmNewPasswordInvalidReason}
                                </div>
                            </td>
                        </tr>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn-dark' onClick={this.resetPassword}
                            disabled={!this.enableResetPasswordButton()}>
                        Reset Password
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    render() {
        return !this.state.loaded ? <h1 className='text-center mt-5'>Loading...</h1> : (
            <React.Fragment>
                <Container className="mt-5">
                    <h4>Account Settings</h4>
                    <hr className="mt-4"/>
                    <table className="mt-3">
                        <tr>
                            <td>
                                <h5 className="mr-3">Username:</h5>
                            </td>
                            <td>
                                <input className='rounded-border' type="text" value={this.state.username}
                                       onChange={this.setUsername}/>
                            </td>
                            <td>
                                <div className='ml-1'>
                                    {this.state.usernameInvalidReason}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h5 className="mt-2 mr-3">Email Address:</h5>
                            </td>
                            <td>
                                <input className='rounded-border' type="text" value={this.state.email}
                                       onChange={this.setEmail}/>
                            </td>
                            <td>
                                <div className='ml-1'>
                                    {this.state.emailInvalidReason}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h5 className="mt-2">Reset Password:</h5>
                            </td>
                            <td>
                                <Button className='btn-dark' size='sm' onClick={this.resetPasswordToggle}>
                                    Click to reset password
                                </Button>
                            </td>
                        </tr>
                    </table>
                    <hr className="my-4"/>
                    <div className="float-right">
                        <Button className="btn-dark" size="lg" disabled={!this.enableSaveButton()}
                                onClick={this.saveSettings}>
                            Save Settings
                        </Button>
                    </div>
                </Container>

                {this.renderResetPassword()}
            </React.Fragment>
        );
    }

}