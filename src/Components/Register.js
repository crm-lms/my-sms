import { useState } from "react";
import img1 from "./images/bg-01.jpg";
import img2 from "./images/bg-02.jpg";
import $ from "jquery";
import validator from 'validator'
import "./images/icons/favicon.ico";
import "./vendor/bootstrap/css/bootstrap.min.css";
import "./fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "./fonts/iconic/css/material-design-iconic-font.min.css";
import "./fonts/Linearicons-Free-v1.0.0/icon-font.min.css";
import "./css/main.css";
import "./css/util.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [contact, setContact] = useState("");

    let HideMsgPopup = () => {
        $('.container-contact100').fadeOut(300);
    }

    let ShowMsgPopup = () => {
        $('.container-contact100').fadeIn(300);
    }

    let LoginPage = () => {
        window.location.href = "Login";
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
            if (username === "" || password === "" || email === "" || address === "" || contact === "") {
                checkValid();
            }
            else {
                if (validator.isEmail(username)) {
                    let url = "http://localhost:5081/api/CRM/UserRegister?";
                    let businessName = "businessName=" + username;
                    let Email = "&Email=" + email;
                    let passwords = "&password=" + password;
                    let mobile = "&mobile=" + contact;
                    let addresses = "&address=" + address;

                    fetch(url + businessName + Email + passwords + mobile + addresses).then((res) => res.json()).then((json1) => { localStorage.setItem('RegisterData', JSON.stringify(json1)); })
                    debugger
                    const RegisterData = JSON.parse(localStorage.getItem('RegisterData'));
                    debugger
                    if (RegisterData.Email != "") {
                        window.location.href = "Login";

                    } else {
                        localStorage.setItem('RegisterData', null);
                        toast('Email and Password is wrong!');
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
                    <div>
                        <a href="#" className="contact100-header-logo">
                            <img src="https://icons.iconarchive.com/icons/fa-team/fontawesome/128/FontAwesome-Comment-Sms-icon.png" alt="LOGO"></img>
                        </a>
                        <button className="btn-show-contact100" onClick={ShowMsgPopup}>
                            Register
                        </button>
                    </div>
                </div>
            </div>
            <div className="container-contact100">
                <div className="wrap-contact100">
                    <button className="left-arrow-hide-contact100" onClick={LoginPage}>
                        <span class="lnr lnr-arrow-left"></span>
                    </button>
                    <button className="btn-hide-contact100" onClick={HideMsgPopup}>
                        <i className="zmdi zmdi-close"></i>
                    </button>
                    <div className="contact100-form-title" style={{ backgroundImage: 'url(' + img2 + ')' }}>
                        <span>Register</span>
                    </div>
                    <form onSubmit={handleSubmit} className="contact100-form validate-form">
                        <div className="wrap-input100 validate-input">
                            <input type="text" id="userName" className="input100" name="name" placeholder="Enter business name" value={username} onChange={(e) => setUserName(e.target.value)} autoComplete="off"></input>
                            <span className="focus-input100"></span>
                            <label className="label-input100" for="email">
                                <span className="lnr lnr-user m-b-5"></span>
                            </label>
                        </div>
                        <div className="wrap-input100 validate-input">
                            <input type="text" id="email" className="input100" name="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off"></input>
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

                        <div className="wrap-input100 validate-input">
                            <input type="text" id="phone" className="input100" name="phone" placeholder="Mobile number" pattern="[0-9]*" maxLength={10} value={contact} onChange={(e) => setContact(e.target.value)} autoComplete="off"></input>
                            <span className="focus-input100"></span>
                            <label className="label-input100" for="phone">
                                <span className="lnr lnr-smartphone m-b-5"></span>
                            </label>
                        </div>

                        <div className="wrap-input100 validate-input">
                            <textarea type="textarea" id="address" className="input100 textarea" name="address" placeholder="Your address..." value={address} onChange={(e) => setAddress(e.target.value)}></textarea>
                            <span className="focus-input100"></span>
                            <label className="label-input100 rs1" for="address">
                                <span class="lnr lnr-map-marker"></span>
                            </label>
                        </div>

                        <div className="container-contact100-form-btn">
                            <button className="contact100-form-btn">
                                Register
                            </button>
                        </div>
                        <ToastContainer />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;