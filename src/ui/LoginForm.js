import React, { Component } from 'react';
import Auth from '../Auth';
import axios from 'axios';
const api = axios.create({
    withCredentials: true,
    headers: {'Content-Type': 'application/json',}
})

class LoginForm extends Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSignUpSubmit = this.handleSignUpSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);

        this.state = {
            name: undefined,
            email: undefined,
            password: undefined,
            signUp: {
                success: undefined,
                message: []
            },
            logged: false,
            users: undefined,
            error: undefined
        }
    }
    static displayName = 'ui-LoginForm'
    componentDidMount() {
        //        this.verifytoken();
    }
    showAuthorizedArea() {
        if (this.state.logged) {
            return (
                <div>
                    <button type="button" className="btn btn-primary btn-block" data-toggle="modal" data-target="#authenticatedModal" data-whatever="@mdo" >Call Authenticated only API</button>
                    <small id="emailHelp" className="form-text text-muted">Only registered and logged users can call and see the list. Plese click the button above to call the API.</small>
                </div>
            );
        }
    }

    /*
    Register Form area
    */
    handleSignUpSubmit(e) {
        e.preventDefault();
        let dataToSend = {
            name: this.refs.username.value,
            email: this.refs.email.value,
            password: this.refs.password.value
        };
        let url = 'http://localhost:3001/users/register';
        api.post(url, dataToSend)
            .then(res => {
                console.log(res);
                console.log(res.data);
                if (res.data.errors) {
                    this.setState({ signUp: { message: res.data.errors } });
                } else if (res.data.success === true) {
                    this.setState({ signUp: { success: true, message: [{ param: 'success', msg: res.data.message }] } });
                } else {
                    this.setState({ signUp: { success: false, message: [{ param: 'error', msg: res.data.message }] } });
                }
            })
            .catch(err => console.log('Error ', err));
    }
    /*
    Login Form area
    */
    handleSubmit(e) {
        e.preventDefault();
        let dataToSend = {
            email: this.state.email,
            password: this.state.password
        }
        console.log(JSON.stringify(dataToSend))
        let url = 'http://localhost:3001/auth/login';
        api.post(url, dataToSend)
            .then(res => {
                console.log(res);
                console.log(res.data);
                if (res.data.success == true) {
                    this.setState({ success: true });
                    Auth.authenticate(() => { this.props.history.push('/home') })
                } else {
                    this.setState({ error: res.data.error });
                }
            })
            .catch(err => console.log('Error ', err));

        e.target.reset()
    }
    handleEmailChange(e) {
        this.setState({
            email: e.target.value
        });
    }
    handlePasswordChange(e) {
        this.setState({
            password: e.target.value
        });
    }
    renderError(msg) {
        let error = this.state.signUp.message.filter((e) => e.param === msg)[0];
        if (error)
            return (<span className="error text-danger">{error.msg}</span>)
    }
    isInvalid(item) {
        // // return true;
        if (this.state.signUp.message.length === 0) return false;
        let error = this.state.signUp.message.filter((e) => e.param === item)[0];
        return (error !== undefined);
        // return (this.state.signUp.message.filter(x => x.param === item)[0] == null);
    }
    render() {
        return (
            <div className="container">
                {/* Begin Modal Register Form */}
                <div className="modal fade" id="signupModel" tabIndex="-1" role="dialog" aria-labelledby="signupModelLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="signupModelLabel">Registration Form</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {
                                    this.state.signUp.success !== undefined && (
                                        this.state.signUp.success === true ?
                                            <div className="alert alert-success" role="alert">
                                                {this.state.signUp.message[0].msg}
                                            </div>
                                            :
                                            <div>
                                                <div className="alert alert-danger" role="alert">
                                                    {this.state.signUp.message[0].msg}
                                                </div>
                                            </div>
                                    )
                                }
                                <form onSubmit={this.handleSignUpSubmit}>
                                    <div className="form-group error">
                                        <label htmlFor="recipient-name" className="form-control-label">Name</label>
                                        <input type="text" ref="username" className={"form-control is-invalid" + (this.isInvalid("name") && ' has-error')} id="username" />
                                        {this.isInvalid('name') ? this.renderError('name') : ''}
                                    </div>
                                    <div className="form-group has-warning">
                                        <label htmlFor="email" className="form-control-label">Email</label>
                                        <input type="email" ref="email" className={"form-control is-invalid" + (this.isInvalid('email') && ' has-error')} id="email" />
                                        {this.isInvalid('email') ? this.renderError('email') : ''}
                                    </div>
                                    <div className="form-group error">
                                        <label htmlFor="message-text" className="form-control-label">Password:</label>
                                        <input type="password" ref="password" className={"form-control is-invalid" + (this.isInvalid('password') && ' has-error')} id="password" />
                                        {this.isInvalid('password') ? this.renderError('password') : ''}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        <button type="submit" className="btn btn-primary">Register</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Begin Modal Register Form */}

                {/* Begin Login Form */}
                <div className="row" style={{ paddingTop: '50px' }}>
                    <div className="col">
                    </div>
                    <div className="col">
                        <div className="card" style={{ width: '20rem', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                            <img className="card-img-top" src="https://s26913.pcdn.co/wp-content/uploads/2018/07/AdobeStock_196731274-1013x440.jpeg" alt="" />
                            <div className="card-body">
                                {this.isInvalid('name') ? this.renderError('name') : ''}
                                {
                                    this.state.error !== undefined && (
                                        <div>
                                            <div className="alert alert-danger" role="alert">
                                                {this.state.error}
                                            </div>
                                        </div>
                                    )
                                }
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Email address</label>
                                        <input type="email" onChange={this.handleEmailChange} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputPassword1">Password</label>
                                        <input type="password" onChange={this.handlePasswordChange} className="form-control" id="exampleInputPassword1" placeholder="Password" />
                                    </div>
                                    <div className="form-check">
                                        <label className="form-check-label">
                                            <input type="checkbox" className="form-check-input" />
                                            <span>Remember me</span>
                                        </label>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block">Login</button>
                                    <small id="emailHelp" className="form-text text-muted">If you are not registered. Plese <a href="" data-toggle="modal" data-target="#signupModel" data-whatever="@mdo" >Signup</a></small>
                                    <br />
                                    {
                                        this.showAuthorizedArea()
                                    }
                                </form>


                            </div>
                        </div>

                    </div>
                    <div className="col">
                    </div>
                </div>
                {/* End Login Form */}
            </div>
        );
    }
}
export default LoginForm;