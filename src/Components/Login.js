import { useState } from "react";
import img1 from "./images/bg-01.jpg";
import img2 from "./images/bg-02.jpg";
import $ from "jquery";
import Swal from "sweetalert2"; //npm install --save sweetalert2
import "./images/icons/favicon.ico";
import "./vendor/bootstrap/css/bootstrap.min.css";
import "./fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "./fonts/iconic/css/material-design-iconic-font.min.css";
import "./fonts/Linearicons-Free-v1.0.0/icon-font.min.css";
import "./css/main.css";
import "./css/util.css";
import validator from 'validator'
import request from "../../node_modules/superagent/dist/superagent";

function App() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    let HideMsgPopup = () => {
        $('.container-contact100').fadeOut(300);
    }

    let ShowMsgPopup = () => {
        $('.container-contact100').fadeIn(300);
    }

    let checkValid = () => {
        $('.validate-input .input100').each(
            function () {
                $(this).on('blur', function () {
                    if (validate(this) == false) {
                        showValidate(this);
                    }
                    else {
                        $(this).parent().addClass('true-validate');
                    }
                })
            })

        var input = $('.validate-input .input100');

        $('.validate-form').on('submit', function () {
            var check = true;
            for (var i = 0; i < input.length; i++) {
                if (validate(input[i]) == false) {
                    showValidate(input[i]);
                    check = false;
                }
            }
            return check;
        });

        $('.validate-form .input100').each(function () {
            $(this).focus(function () {
                hideValidate(this);
                $(this).parent().removeClass('true-validate');
            });
        });

        function validate(input) {
            if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
                if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) { return false; }
            }
            else { if ($(input).val().trim() == '') { return false; } }
        }

        function showValidate(input) {
            var thisAlert = $(input).parent();

            $(thisAlert).addClass('alert-validate');

            $(thisAlert).append('<span class="btn-hide-validate">&#xf136;</span>');

            $('.btn-hide-validate').each(function () {
                $(this).on('click', function () {
                    hideValidate(this);
                });
            });
        }

        function hideValidate(input) {
            var thisAlert = $(input).parent();
            $(thisAlert).removeClass('alert-validate');
            $(thisAlert).find('.btn-hide-validate').remove();
        }
    }

    let handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (username === "" || password === "") {
                checkValid();
            }
            else {
                if (validator.isEmail(username)) {

                    let headers = new Headers();

                    headers.append('Content-Type', 'application/json');
                    headers.append('Accept', 'application/json');
                    headers.append('Access-Control-Allow-Origin', '*');
                    headers.append('Origin', 'http://localhost:5081');

                    let url = "http://localhost:5081/api/CRM/GetLogin?";
                    let email = "email=" + username;
                    let passwords = "&password=" + password;
                    debugger
                    fetch(url + email + passwords, { method: 'GET', headers: headers }).then((res) => res.json()).then((json1) => { localStorage.setItem('LoginData', JSON.stringify(json1)); })
                    debugger
                    const LoginData = JSON.parse(localStorage.getItem('LoginData'));
                    debugger
                    console.log(LoginData)
                    alert(LoginData);

                    if (LoginData != null && LoginData.isSelected == true) {
                        window.location.href = "SendMessage";
                    } else {
                        localStorage.setItem('LoginData', null);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Email and Password is wrong!',
                            footer: 'Please try again.'
                        })
                    }
                }
                else {
                    checkValid();
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="App">
            <div className="bg-container-contact100" style={{ backgroundImage: 'url(' + img1 + ')' }}>
                <div className="contact100-header flex-sb-m">
                    <a href="#" className="contact100-header-logo">
                        <img src="https://icons.iconarchive.com/icons/fa-team/fontawesome/128/FontAwesome-Comment-Sms-icon.png" alt="LOGO"></img>
                    </a>
                    <div>
                        <button className="btn-show-contact100" onClick={ShowMsgPopup}>
                            Login
                        </button>
                    </div>
                </div>
            </div>
            <div className="container-contact100">
                <div className="wrap-contact100">
                    <button className="btn-hide-contact100" onClick={HideMsgPopup}>
                        <i className="zmdi zmdi-close"></i>
                    </button>
                    <div className="contact100-form-title" style={{ backgroundImage: 'url(' + img2 + ')' }}>
                        <span>Login</span>
                    </div>
                    <form onSubmit={handleSubmit} className="contact100-form validate-form">

                        <div className="wrap-input100 validate-input">
                            <input type="text" id="email" className="input100" name="email" placeholder="example@email.com" value={username} onChange={(e) => setUserName(e.target.value)} autoComplete="off"></input>
                            <span className="focus-input100"></span>
                            <label className="label-input100" for="email">
                                <span className="lnr lnr-envelope m-b-5"></span>
                            </label>
                        </div>

                        <div className="wrap-input100 validate-input">
                            <input type="password" id="password" className="input100" name="password" placeholder="******" maxLength={8} value={password} onChange={(e) => setPassword(e.target.value)}></input>
                            <span className="focus-input100"></span>
                            <label className="label-input100" for="email">
                                <span className="lnr lnr-lock m-b-5"></span>
                            </label>
                        </div>
                        <p className="text">Don't have an account? <a href="/my-sms/Register"> Register</a></p>
                        <div className="container-contact100-form-btn">
                            <button className="contact100-form-btn">
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;