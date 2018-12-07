import React, { Component } from 'react';
import PostFileUploads from './PostFileUploads';
import Auth from '../Auth';
import axios from 'axios';
const api = axios.create({
    withCredentials: true,
    headers: { 'Content-Type': 'application/json', }
})


class Home extends Component {
    constructor() {
        super();
        this.logout = this.logout.bind(this);
        this.reloadImages = this.reloadImages.bind(this)
        this.searchImage = this.searchImage.bind(this)
        this.loadImages = this.loadImages.bind(this)

        this.loadImages()
        this.state = {
            logged: false,
            images: undefined,
            error: undefined
        }
    }
    componentDidMount() {
        //        this.loadImages()
    }
    reloadImages() {
        this.loadImages()
    }

    loadImages() {

        let url = 'https://backend-web2.herokuapp.com/image';
        api.get(url).then((res) => {
            console.log(res)
            if (res.data.status === 'not authorized')
                this.logout()
            this.setState({
                images: res.data.images,
                error: undefined
            })

        })
            .catch(err => this.setState({ error: err }));
    }

    logout() {
        api.get('https://backend-web2.herokuapp.com/auth/logout').then(Auth.signout(() => this.props.history.push('/login')));
    }

    searchImage() {
        let url = 'https://backend-web2.herokuapp.com/image?q='+this.refs.searchInput.value;
        api.get(url).then((res) => {
            console.log(res)
            if (res.data.status === 'not authorized')
                this.logout()
            alert(res.data.images.length + ' resultados');
            this.setState({
                images: res.data.images,
                error: undefined
            })

        })
            .catch(err => this.setState({ error: err }));
    }

    render() {
        return (
            <div className="container">
                <button onClick={this.logout}>
                    Logout
                </button>
                <PostFileUploads parentMethod={this.reloadImages} />


                {/* Begin Modal List Authenticad List  */}
                <div className="align-content-between">
                    <div className="card border-ligth com-md-12">
                        <div className="card-body d-flex justify-content-center align-middle">
                            <p className="card-text">Procure pelo nome:  </p>
                            <br/>
                            <div class="m-2 align-middle">
                                <input type="text" ref="searchInput"/>
                                <button className="btn btn-info " onClick={this.searchImage}>Buscar</button>
                                <button className="btn btn-warning" onClick={this.loadImages}> Mostrar Todas</button>
                            </div>
                        </div>
                    </div>
                    {
                        /**
                         * List the images when authenticated
                         */
                        (this.state.images !== undefined && this.error === undefined) ? (
                            this.state.images.map((image) => (
                                <div className="d-flex flex-row justify-content-center">
                                    <div className="">
                                        <img height="250px" src={image.filename} width="250px" alt="img" />
                                        <br />
                                    </div>
                                </div>
                            ))
                        ) : 
                        (
                        <p className="alert alert-info">Não há imagens no servidor.</p>
                        )
                    }
                </div>
                {/* End Modal List Authenticad List */}
            </div>
        );

    }
}

export default Home;