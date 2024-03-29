import { useState } from "react";
import img1 from "./images/bg-01.jpg";
import img2 from "./images/bg-02.jpg";
import $ from "jquery";
import { read, utils, writeFile } from 'xlsx'; //npm i xlsx
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
    const [From, setFrom] = useState("");
    const [messageSend, setMessageSend] = useState("");
    const [movies, setMovies] = useState([]);
    const [uploadAlert, setuploadAlert] = useState("");
    //const [CheckBox, setCheckBox] = useState(true);
    const handleImport = ($event) => {
        const files = $event.target.files;
        const extension = files[0].name.split('.').pop();
        if (files.length && (extension === "xls" || extension === "xlsx" || extension === "csv")) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;
                if (sheets.length) {
                    const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                    setMovies(rows);
                    toast.success('File uploaded successfully!', {
                        position: toast.POSITION.TOP_CENTER
                    });
                    setuploadAlert(" File uploaded successfully");
                    localStorage.setItem('FileData', JSON.stringify(rows));
                }
            }
            reader.readAsArrayBuffer(file);
        }
        else {
            toast.warning('You have invalid file uploaded, Please upload xlsx, xls or csv file.', {
                position: toast.POSITION.TOP_CENTER
            });
            localStorage.setItem('FileData', null);
            setTimeout(() => { window.location.reload(); }, 2000);
        }
    }

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
            const FileData = JSON.parse(localStorage.getItem('FileData'));
            if (From === "" || messageSend === "" || FileData === null) {
                checkValid();
            }
            else {
                const numbers = [];
                FileData.forEach((data) => { numbers.push(data.Number); })
                let url = "https://localhost:7141/api/CRMSendMessage/SendSmsTwilio?";
                let to = "To=" + numbers;
                let from = "&From=" + From;
                let message = "&Message=" + messageSend;
                let res = fetch(url + to + from + message, { method: "POST" });
                let resJson = res.json();
                if (res.status === 200 && resJson != null) {
                    setFrom("");
                    setMessageSend("");
                    toast.success('Message Send Successfully.', {
                        position: toast.POSITION.TOP_CENTER
                    });
                    localStorage.clear();
                } else {
                    toast.error('Message Not Send Successfully.', {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    // const CheckBoxChange = () =>{
    //     setCheckBox(false);
    //     alert(CheckBox);
    // }
    let LoginPage = () => {
        localStorage.setItem('LoginData', null);
        window.location.href = "Login";
    }
    const LoginData = JSON.parse(localStorage.getItem('LoginData'));

    return (
        <div className="App">
            <div className="bg-container-contact100" style={{ backgroundImage: 'url(' + img1 + ')' }}>
                <div className="contact100-header flex-sb-m">
                    <a href="#" className="contact100-header-logo">
                        <img src="https://icons.iconarchive.com/icons/fa-team/fontawesome/128/FontAwesome-Comment-Sms-icon.png" alt="LOGO"></img>
                    </a>
                    <button className="btn-show-contact100" onClick={ShowMsgPopup}>
                        <span className="lnr lnr-location mr-1"></span> Send Message
                    </button>
                </div>
            </div>
            <div className="container-contact100">
                <div className="wrap-contact100">
                    <button className="logout-contact100" onClick={LoginPage}>
                        <span class="lnr lnr-exit-up"></span> Sign Out
                    </button>
                    <button className="btn-hide-contact100" onClick={HideMsgPopup}>
                        <i className="zmdi zmdi-close"></i>
                    </button>
                    <div className="contact100-form-title" style={{ backgroundImage: 'url(' + img2 + ')' }}>
                        <span>Send Bulk SMS</span>
                    </div>
                    <div className="welcome welcome-1">
                        <span>Well-Come: {LoginData.BusinessName}</span>
                    </div>
                    <form onSubmit={handleSubmit} className="contact100-form validate-form">

                        {/* <div className="checkInput">
                            <label class="form-control-126">
                                <input type="checkbox" name="checkbox-checkmark" value={CheckBox} onChange={CheckBoxChange}/>
                                Click To Send Bulk Sms
                            </label>
                        </div>                         */}
                        <div className="wrap-input100 validate-input">
                            <input type="text" id="FromPhone" className="input100" pattern="[0-9]*" maxLength={10} name="FromPhone" placeholder="Enter auto register number" value={From} onChange={(e) => setFrom(e.target.value)} autoComplete="off"></input>
                            <span className="focus-input100"></span>
                            <label className="label-input100" for="phone">
                                <span className="lnr lnr-smartphone m-b-2"></span>
                            </label>
                        </div>
                        {/* <div className="wrap-input100 validate-input">
                            <input type="text" id="ToPhone" className="input100" pattern="[0-9]*" maxLength={10} name="ToPhone" placeholder="(To) Customer Number " value={To} onChange={(e) => setTo(e.target.value)}></input>
                            <span className="focus-input100"></span>
                            <label className="label-input100" for="phone">
                                <span className="lnr lnr-smartphone m-b-2"></span>
                            </label>
                        </div> */}
                        <div className="wrap-input100 validate-input">
                            <input type="file" name="file" className="custom-file-input input100" id="inputGroupFile" onChange={handleImport}></input>
                            <span className="focus-input100"></span>
                            <label className="custom-file-label label-input100" for="message" htmlFor="inputGroupFile">
                                <span className="lnr lnr-upload"></span>
                            </label>
                            <label className="uploadAlert">{uploadAlert ? uploadAlert : 'Upload xlsx, xls or csv file'}</label>
                        </div>
                        <div className="wrap-input100 validate-input">
                            <textarea type="textarea" id="message" className="input100 textarea" name="message" placeholder="Your message..." value={messageSend} onChange={(e) => setMessageSend(e.target.value)}></textarea>
                            <span className="focus-input100"></span>
                            <label className="label-input100 rs1" for="message">
                                <span className="lnr lnr-bubble"></span>
                            </label>
                        </div>
                        <div className="container-contact100-form-btn">
                            <button className="contact100-form-btn">
                                <span className="lnr lnr-location mr-2"></span> Send Now
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