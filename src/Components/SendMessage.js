import { useState } from "react";
import "./images/icons/favicon.ico";
import "./vendor/bootstrap/css/bootstrap.min.css";
import "./fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "./fonts/iconic/css/material-design-iconic-font.min.css";
import "./fonts/Linearicons-Free-v1.0.0/icon-font.min.css";
import "./css/main.css";
import "./css/util.css";
import img1 from "./images/bg-01.jpg";
import img2 from "./images/bg-02.jpg";
import $ from "jquery";
import { read, utils, writeFile } from 'xlsx'; //npm i xlsx
import Swal from "sweetalert2"; //npm install --save sweetalert2

function App() {
    //const [To, setTo] = useState("");
    const [From, setFrom] = useState("");
    const [messageSend, setMessageSend] = useState("");
    //const [messageAlert, setMessageAlert] = useState("");
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
                    Swal.fire(
                        'Congrats!',
                        'File uploaded successfully!',
                        'success'
                      )
                    setuploadAlert("File uploaded successfully");
                    localStorage.setItem('FileData', JSON.stringify(rows));
                    $('.uploadAlert').addClass('uploadAlert1');
                }
            }
            reader.readAsArrayBuffer(file);
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You have invalid file uploaded!',
                footer: 'Please upload xlsx, xls or csv file.'
            })

            localStorage.setItem('FileData', null);
            $('.swal2-actions').hide();
            setTimeout(() => { window.location.reload(); }, 3000);
        }
    }

    let checkValid = ()=>{
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

        $('.btn-hide-contact100').on('click', function () {
            $('.container-contact100').fadeOut(300);
        });

        $('.btn-show-contact100').on('click', function () {
            $('.container-contact100').fadeIn(300);
        });
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
                let url = "http://localhost:5098/api/Sms/SendSms?";
                let to = "To=" + numbers;
                let from = "&From=" + From;
                let message = "&Message=" + messageSend;
                let res = fetch(url + to + from + message, { method: "POST" });
                let resJson = res.json();
                if (res.status === 200 && resJson != null) {
                    //setTo("");
                    setFrom("");
                    setMessageSend("");
                    Swal.fire(
                        'Congrats!',
                        'Send messages successfully!',
                        'success'
                      )
                    localStorage.clear();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Not send!',
                        footer: 'Please try again.'
                    })
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

    return (
        <div className="App">
            <div className="bg-container-contact100" style={{ backgroundImage: 'url(' + img1 + ')' }}>
                <div className="contact100-header flex-sb-m">
                    <a href="#" className="contact100-header-logo">
                        <img src="images/icons/logo.png" alt="LOGO"></img>
                    </a>
                    <div>
                        <button className="btn-show-contact100">
                            Send Message
                        </button>
                    </div>
                </div>
            </div>
            <div className="container-contact100">
                <div className="wrap-contact100">
                    <button className="btn-hide-contact100">
                        <i className="zmdi zmdi-close"></i>
                    </button>
                    <div className="contact100-form-title" style={{ backgroundImage: 'url(' + img2 + ')' }}>
                        <span>Send Message</span>
                    </div>
                    <form onSubmit={handleSubmit} className="contact100-form validate-form">
                        {/* <div className="checkInput">
                            <label class="form-control-126">
                                <input type="checkbox" name="checkbox-checkmark" value={CheckBox} onChange={CheckBoxChange}/>
                                Click To Send Bulk Sms
                            </label>
                        </div>                         */}
                        <div className="wrap-input100 validate-input">
                            <input type="text" id="FromPhone" className="input100" pattern="[0-9]*" maxLength={10} name="FromPhone" placeholder="From Auto Register Number" value={From} onChange={(e) => setFrom(e.target.value)} autoComplete="off"></input>
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
                            <input type="file" name="file" className="custom-file-input input100" id="inputGroupFile" onChange={handleImport}
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"></input>
                            <span className="focus-input100"></span>
                            <label className="custom-file-label label-input100" for="message" htmlFor="inputGroupFile">
                                <span className="lnr lnr-upload"></span>
                            </label>
                            <label className="uploadAlert">{uploadAlert ? uploadAlert : 'Select xls, xlsx or csv file'}</label>
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
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;