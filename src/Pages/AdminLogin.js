import { useFormik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from 'yup';
import FetchData from '../Hooks/FetchData'
import React, { useState, } from "react";
import useSession from '../Context/SessionContext'
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import iconLogin from '../assets/img/login_icon.png'

function AdminLogin() {
    const [getSession, setSession] = useSession();
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
            let endpoint = 'login'
            let body = {
                Credentials: {
                    email: data.Email,
                    password: data.Password,
                }
            }

            FetchData(endpoint, httpMethod, body, (result) => {
                if (result?.data?.error) {
                    setAlertType('danger')
                    setMessage(result?.data?.message)
                }
                else {
                    let session = {
                        message: result.data.message,
                        data: result.data.data,
                        error: result.data.error,
                        isAdmin: result.data.data[0].PreviligeName === 'Admin' ? true : false,
                        isAppDeveloper: result.data.data[0].PreviligeName === 'AppDeveloper' ? true : false,
                        //getSession()?.isSuperAdmin = result.data.data[0].PreviligeName === 'Super Admin' ? true : false
                        schoolID: result.data.data[0].SchoolID,
                        userID: result.data.data[0].UserID,
                        emailID: result.data.data[0].EmailID,
                    }
                    setSession(session)
                    navigate('/dashboard')
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
                                <div className="card-header bg-light d-flex flex-row align-items-center">
                                    <img src={iconLogin} className="icon-48" />
                                    <h1 className="">Login</h1>
                                </div>
                                <div className="card-body">
                                    <div className="card-title px-4 ">
                                        <h5 className="text-center">Admin's Login Only</h5>
                                    </div>
                                    <form className="row g-3 " onSubmit={formik.handleSubmit}>
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="Email">Email </label>
                                                <input
                                                    name="Email"
                                                    type="email"
                                                    className="form-control"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.Email}
                                                />
                                                <p className="text-danger">{formik.errors.Email}</p>
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
                                                <p className="text-danger">{formik.errors.Password}</p>
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
                                    </form>
                                </div>
                                <div className="card-footer bg-light m-0 p-0">
                                    {
                                        alertType === 'danger' ?
                                            <Alert key={alertType} variant={alertType}>
                                                {message}
                                            </Alert>
                                            : <></>
                                    }
                                    <div className="m-2 d-flex flex-column align-items-end justify-content-center">
                                        <Link to='/login' className="link-primary">Login at Booth</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

        </div>
    );
}

export default AdminLogin;