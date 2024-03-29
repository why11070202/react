import React from 'react';
import { withRouter } from 'react-router-dom'
import '../css/Header.css';
import '../Iconfont/iconfont.css'
class Header extends React.Component {
    constructor(porps) {
        super(porps);
        this.state = {
            isok: false,
            name: ''
        }
    }
    toggle() {
        this.setState({
            isok: !this.state.isok
        })
    }
    // 退出
    exit() {
        localStorage.clear()
        this.props.history.push('/login')
        this.setState({
            isok: !this.state.isok
        })
    }
    componentDidMount() {
        let stuinfo = window.localStorage.getItem('stuinfo');
        if (stuinfo) {
            // console.log(JSON.parse(stuinfo));
            this.setState({
                name: JSON.parse(stuinfo).name,
            })
        }

    }
    render() {
        return (
            <div className="header">
                <div className="h_l">
                    <img src='http://stu.1000phone.net/Public/assets/css/images/logo.png?1565695884'></img>
                </div>
                <div className="h_r" onClick={this.toggle.bind(this)}>
                    <a>{this.state.name}
                        <i className="iconfont icon-xialajiantou"></i>
                    </a>
                </div>
                <div className="exit" style={{ 'display': this.state.isok ? 'block' : 'none' }} onClick={this.exit.bind(this)}>
                    <hr />
                    <p> <i className="iconfont icon-exit"></i>
                        <span> 退出</span></p>
                </div>
            </div>
        )
    }
}
export default withRouter(Header) 