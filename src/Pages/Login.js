import { useFormik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from 'yup';
import FetchData from '../Hooks/FetchData'
import React, { useContext, useEffect, useState, } from "react";
import SessionContext from '../Context/SessionContext'
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

function Login() {
    const { session } = useContext(SessionContext);
    const navigate = useNavigate();
    const [alertType, setAlertType] = useState('')
    const [message, setMessage] = useState('')

    const validationSchema = Yup.object().shape({
        Email: Yup.string().email().required('Email is required'),
        Password: Yup.string().required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            Email: "",
            Password: "",
        },
        validationSchema,
        onSubmit: (data) => {
            let httpMethod = 'post'
            let endpoint = 'http://localhost:8000/login'
            let body = {
                Credentials: {
                    email: data.Email,
                    password: data.Password,
                }
            }

            FetchData(endpoint, httpMethod, body, (result) => {
                if (result.data.error) {
                    setAlertType('danger')
                    setMessage(result.data.message)
                }
                else {
                    session.message = result.data.message
                    session.data = result.data.data
                    session.error = result.data.error
                    session.isAdmin = result.data.data[0].PreviligeName === 'Admin' ? true : false
                    session.isSuperAdmin = result.data.data[0].PreviligeName === 'Super Admin' ? true : false
                    session.schoolID = result.data.data[0].SchoolID
                    session.userID = result.data.data[0].UserID
                    navigate(session.isAdmin || session.isSuperAdmin === true ? '/dashboard' : '/search')
                }
            })
        },
    });

    return (
        <div className="container">
            <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <div className="pt-4 pb-2">
                                        <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                                        <p className="text-center small">Enter your Email & password to login</p>
                                    </div>

                                    <form className="row g-3 " onSubmit={formik.handleSubmit}>
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="Email"> Email </label>
                                                <input
                                                    name="Email"
                                                    type="email"
                                                    className="form-control"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.Email}
                                                />
                                                <div className="text-danger">
                                                    {formik.errors.Email ? formik.errors.Email : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="form-group">
                                                <div>
                                                    <label htmlFor="Password" >Password</label>
                                                    <input
                                                        name="Password"
                                                        type="password"
                                                        className="form-control"
                                                        onChange={formik.handleChange}
                                                        value={formik.values.Password}
                                                    />
                                                </div>
                                                <div className="text-danger">
                                                    {formik.errors.Password ? formik.errors.Password : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" name="remember" value="true" id="rememberMe" />
                                                <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <button className="btn btn-primary w-100" type="submit">Login</button>
                                        </div>
                                        <div className="col-12">
                                            <Alert key={alertType} variant={alertType}>
                                                {message}
                                            </Alert>
                                        </div>
                                    </form>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </section>

        </div>
    );
}

export default Login;
