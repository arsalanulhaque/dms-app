import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalTitle from "react-bootstrap/ModalTitle";
import ModalBody from "react-bootstrap/ModalBody";
import ModalFooter from "react-bootstrap/ModalFooter";
import { useFormik } from "formik";
import * as Yup from 'yup';
import Dropdown from './Controls/Dropdown'
import FetchData from '../Hooks/FetchData'
import Alert from 'react-bootstrap/Alert';

function UsersIU(props) {
    const [isVisible, setVisible] = useState(false)
    const [message, setMessage] = useState('')
    const [alertType, setAlertType] = useState('')

    const validationSchema = Yup.object().shape({
        SchoolID: Yup.number().min(1, 'School is required'),
        EmailID: Yup.string().required('Email is required').email("Email is invalid"),
        Username: Yup.string().required('User name is required').matches(new RegExp('^\'?\\p{L}+(?:[0-9])*[\' ]?$', 'gmu'), 'Special charactes are not allowed!'),
        Password: Yup.string().required('Password is required'),
        PreviligeID: Yup.number().min(1, 'Previlige is required'),
    });

    const formik = useFormik({
        initialValues: {
            UserID: -1,
            SchoolID: -1,
            PreviligeID: -1,
            EmailID: "",
            Username: "",
            Password: "",
        },
        validationSchema: validationSchema,
        validateOnChange: true,
        validateOnBlur: false,
        onSubmit: (data) => {
            let httpMethod = props.editRow?.UserID > 0 ? 'put' : 'post'
            let endpoint = 'users'
            let body = {
                "user": {
                    "UserID": props?.editRow?.UserID > 0 ? props?.editRow?.UserID : null,
                    "SchoolID": formik.values.SchoolID,
                    "PreviligeID": formik.values.PreviligeID,
                    "EmailID": data.EmailID,
                    "Password": data.Password,
                    "Username": data.Username,
                }
            }

            FetchData(endpoint, httpMethod, body, (result) => {
                if (!result.data.error) {
                    hideModal(result?.data?.error === true ? 'danger' : 'success', result?.data?.message)
                }
                else {
                    setAlertType('danger')
                    setMessage(result.data.message)
                }
            })
        },

    });

    useEffect(() => {
        if (props?.editRow?.UserID > -1) {
            showModal()
            formik.initialValues.UserID = props?.editRow?.UserID || -1
            formik.initialValues.SchoolID = props?.editRow?.FKSchoolID || -1
            formik.initialValues.PreviligeID = props?.editRow?.FKPreviligeID || -1
            formik.initialValues.EmailID = props?.editRow?.EmailID || ''
            formik.initialValues.Username = props?.editRow?.Username || ''
            formik.initialValues.Password = props?.editRow?.Password || ''
        } else {
            formik.initialValues.UserID = -1
            formik.initialValues.SchoolID = -1
            formik.initialValues.PreviligeID = -1
            formik.initialValues.EmailID = ""
            formik.initialValues.Username = ""
            formik.initialValues.Password = ""
        }
    }, [props, isVisible, formik, formik.initialValues])

    const showModal = () => {
        setVisible(true)
    };

    const hideModal = (alertType, msg) => {
        formik.resetForm()
        setMessage('')
        setVisible(false)
        props.handleModalClosed(msg, alertType, true);
    };

    const onSchoolChange = (e) => {
        formik.initialValues.SchoolID = e.target.selectedOptions[0].id
    }

    return (
        <>
            <button type="button" className="btn btn-primary mt-3 float-end" onClick={showModal}>
                Add New User
            </button>
            <Modal show={isVisible} size="lg" dialogClassName={"primaryModal"}>
                <form onSubmit={formik.handleSubmit}>
                    <ModalHeader>
                        <ModalTitle>{props?.editRow?.UserID > -1 ? 'Update Existing' : 'Add New'} User</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        {message.length <= 0 ? null : <Alert key={alertType} variant={alertType}>
                            {message}
                        </Alert>}
                        <div className="">
                            <div className="form-group">
                                <label htmlFor="SchoolID">School Name</label>
                                <Dropdown name="SchoolID"
                                    api="school"
                                    keyField='SchoolID'
                                    valueField='SchoolName'
                                    selectedValue={formik.values.SchoolID}
                                    onChange={value => formik.setFieldValue('SchoolID', value.value)}
                                />
                                <div className="text-danger">
                                    {formik.errors.SchoolID ? formik.errors.SchoolID : null}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="Username">User Name</label>
                                <input
                                    name="Username"
                                    type="text"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={formik.values.Username}
                                />
                                <div className="text-danger">
                                    {formik.errors.Username ? formik.errors.Username : null}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="EmailID">Email ID</label>
                                <input
                                    name="EmailID"
                                    type="text"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={formik.values.EmailID}
                                />
                                <div className="text-danger">
                                    {formik.errors.EmailID ? formik.errors.EmailID : null}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="Password">Password</label>
                                <input
                                    name="Password"
                                    type="password"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={formik.values.Password}
                                    autoComplete="new-password" />
                                <div className="text-danger">
                                    {formik.errors.Password ? formik.errors.Password : null}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="PreviligeID">Role Name</label>
                                <Dropdown name="PreviligeID"
                                    api="previlige"
                                    keyField='PreviligeID'
                                    valueField='PreviligeName'
                                    selectedValue={formik.values.PreviligeID}
                                    onChange={value => formik.setFieldValue('PreviligeID', value.value)}
                                />
                                <div className="text-danger">
                                    {formik.errors.PreviligeID ? formik.errors.PreviligeID : null}
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button type="reset" className="btn btn-warning" onClick={formik.handleReset}>Reset</button>
                        <button type="button" className="btn btn-secondary" onClick={() => hideModal('info', 'Action cancelled by user!')}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </ModalFooter>
                </form>
            </Modal>
        </>
    )
}

export default UsersIU;