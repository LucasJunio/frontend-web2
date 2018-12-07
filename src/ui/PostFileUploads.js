import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import Auth from '../Auth';
class PostFileUploads extends Component {

    constructor(props) {
        super(props);
        this.state = {
            success: true,
            selectedFile: null
        }
    }
    reloadImages = () => {
        this.props.parentMethod();
    }

    fileChangedHandler = (event) => {
        this.setState({
            selectedFile: event.target.files[0]
        });
    };

    uploadHandler = async () => {
        const data = new FormData;
        //        const postId = this.props.match.params.postId; 
        data.append('myImage', this.state.selectedFile, this.state.selectedFile.name)
        let ext = this.state.selectedFile.type.split('/')[1]
        let self = this;
        if (ext !== 'png' && ext !== 'jpg' && ext !== 'gif' && ext !== 'jpeg') {
            alert('Select a valid image ' + ext)
        } else
        if (this.state.selectedFile) {
            await axios.post('https://backend-web2.herokuapp.com/image', data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                if (res.data.status === 'not authorized')
                    self.logout()
                if (res.data.success !== true)
                    alert('arquivo não pode ser salvo!');
                else
                    alert('arquivo salvo com sucesso!');
                self.reloadImages()
                self.setState({success: true, selectedFile: undefined})
            }).catch((err) => {
                console.log(err)
//                self.logout()
                self.reloadImages()
                self.setState({success: true})
            })
            this.reloadImages()

        } else {
            this.ocShowAlert('Please upload a file', 'red');
        }
    };

    logout() {
        axios.get('https://backend-web2.herokuapp.com/auth/logout', { withCredentials: true }).then(
            Auth.signout(() => this.props.history.push('/login'))
        );
        this.props.history.push('/login')
    }

    ocShowAlert = (message, backgroud = '#3089cf') => {
        let alertcontainer = document.querySelector('#oc-alert-container'),
            alertEl = document.createElement('div'),
            textNode = document.createTextNode(message);
        alertEl.setAttribute('class', 'oc-alert-pop-up');
        $(alertEl).css('background', backgroud);
        alertEl.appendChild('slow');
        setTimeout(function () {
            $(alertEl).fadeOut('slow');
            $(alertEl).remove();
        }, 3000);
    }


    render() {
        return (
            <div>
                <div className="container p-5">
                    <div id="oc-alertcontainer"></div>
                    <div className="card border-ligth mb-3 style={{ boxShadow: 'o 5px 10px 2px rgba(195,192,192,.5)' }}">
                        <div className="card-header">
                            <h3 style={{ color: '#555', marginLeft: '12px' }}>Upload de imagem</h3>
                        </div>
                        <div className="card-body">
                            <p className="card-text"> Please upload image</p>
                            <input type="file" onChange={this.fileChangedHandler} />
                            <div className="mt-5">
                                <button className="btn btn-info" onClick={this.uploadHandler}>Upload!</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PostFileUploads;