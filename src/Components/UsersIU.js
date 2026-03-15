import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState, useCallback } from 'react';
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
import useSession from '../Context/SessionContext'

function UsersIU(props) {
    const [getSession] = useSession()
    const session = getSession()
    const [isVisible, setVisible] = useState(false)
    const [message, setMessage] = useState('')
    const [alertType, setAlertType] = useState('')
    const [selectedSchoolId, setSelectedSchoolId] = useState(-1)

    const validationSchema = Yup.object().shape({
        FirstName: Yup.string().required('First Name is required'),
        LastName: Yup.string().required('Last Name is required'),
        Username: Yup.string().required('User name is required').matches(new RegExp('^\'?\\p{L}+(?:[0-9])*[\' ]?$', 'gmu'), 'Special charactes are not allowed!'),
        Password: Yup.string().required('Password is required'),
        EmailID: Yup.string().required('Email is required').email("Email is invalid"),
        SchoolID: Yup.number().min(1, 'School is required'),
        PreviligeID: Yup.number().min(1, 'Previlige is required'),
    });

    const formik = useFormik({
        enableReinitialize: true,
        validationSchema,
        // Only validate on submit; not on each change/blur
        validateOnChange: false,
        validateOnBlur: false,
        initialValues: {
            UserID: props?.editRow?.UserID || -1,
            // For new users, default SchoolID to the logged-in user's school (for School Admins)
            SchoolID: props?.editRow?.FKSchoolID || session?.schoolID || -1,
            PreviligeID: props?.editRow?.FKPreviligeID || -1,
            EmailID: props?.editRow?.EmailID || '',
            Username: props?.editRow?.Username || '',
            Password: props?.editRow?.Password || '',
            FirstName: props?.editRow?.FirstName || '',
            LastName: props?.editRow?.LastName || '',
            NfcID: props?.editRow?.NfcID || '',
            IsAdmin: props?.editRow?.IsAdmin === 1 ? true : false,
        },
        onSubmit: (data) => {
            let httpMethod = props.editRow?.UserID > 0 ? 'put' : 'post'
            let endpoint = 'users'
            let body = {
                "user": {
                    "UserID": props?.editRow?.UserID > 0 ? props?.editRow?.UserID : null,
                    "FirstName": formik.values.FirstName,
                    "LastName": formik.values.LastName,
                    "SchoolID": formik.values.SchoolID,
                    "PreviligeID": formik.values.PreviligeID,
                    "EmailID": data.EmailID,
                    "Password": data.Password,
                    "Username": data.Username,
                    "NfcID": data.NfcID,
                    "IsAdmin": data.IsAdmin === true ? 1 : 0,
                }
            }

            FetchData(endpoint, httpMethod, body, (result) => {
                // Handle axios error (4xx/5xx): backend validation e.g. duplicate NFC
                if (result?.isAxiosError || result?.response) {
                    const status = result?.response?.status;
                    const serverMessage = result?.response?.data?.message;
                    setAlertType('danger');
                    setMessage(serverMessage || result?.message || 'Request failed. Please try again.');
                    return;
                }
                // Success response
                if (!result?.data?.error) {
                    hideModal('success', result?.data?.message);
                    return;
                }
                // 200 with error in body
                setAlertType('danger');
                setMessage(result?.data?.message || 'Something went wrong.');
            })
        },
    });

    const showModal = useCallback(() => {
        setVisible(true)
        props.handleModalOpen(true);
    }, [props]);

    useEffect(() => {
        if (props?.editRow?.UserID > -1) {
            showModal()
            setSelectedSchoolId(props?.editRow?.FKSchoolID || -1)
        }
    }, [props?.editRow?.UserID, props?.editRow?.FKSchoolID, showModal])

    // Handle school selection change
    useEffect(() => {
        // Reset PreviligeID when school changes
        if (selectedSchoolId !== formik.values.SchoolID) {
            setSelectedSchoolId(formik.values.SchoolID)
            formik.setFieldValue('PreviligeID', -1)
        }
    }, [formik, selectedSchoolId])

    const hideModal = (alertType, msg) => {
        formik.resetForm()
        setMessage('')
        setVisible(false)
        setSelectedSchoolId(-1)
        props.handleModalClosed(msg, alertType, true);
    };

    const handleSchoolChange = (value) => {
        formik.setFieldValue('SchoolID', value.value)
        formik.setFieldValue('PreviligeID', -1) // Reset role when school changes
    }

    return (
        <>
            <button type="button" className="btn btn-primary float-end" onClick={showModal}>
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
                            {getSession()?.isAppDeveloper === false ? '' :
                                <div className="form-group">
                                    <label htmlFor="SchoolID">School Name</label>
                                    <Dropdown name="SchoolID"
                                        api="school"
                                        keyField='SchoolID'
                                        valueField='SchoolName'
                                        selectedValue={formik.values.SchoolID}
                                        onChange={handleSchoolChange}
                                    />
                                {formik.submitCount > 0 && formik.errors.SchoolID && (
                                    <div className="text-danger">
                                        {formik.errors.SchoolID}
                                    </div>
                                )}
                                </div>
                            }
                            
                            <div className="form-group">
                                <label htmlFor="PreviligeID">Role Name</label>
                                <Dropdown name="PreviligeID"
                                    api={formik.values.SchoolID > 0 ? `previlige/${formik.values.SchoolID}` : null}
                                    keyField='PreviligeID'
                                    valueField='PreviligeName'
                                    selectedValue={formik.values.PreviligeID}
                                    onChange={value => formik.setFieldValue('PreviligeID', value.value)}
                                    disabled={formik.values.SchoolID <= 0}
                                />
                                {formik.submitCount > 0 && formik.errors.PreviligeID && (
                                    <div className="text-danger">
                                        {formik.errors.PreviligeID}
                                    </div>
                                )}
                                {formik.values.SchoolID <= 0 && (
                                    <small className="text-muted">Please select a school first to see available roles</small>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="FirstName">First Name</label>
                                <input
                                    name="FirstName"
                                    type="text"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={formik.values.FirstName}
                                />
                                {formik.submitCount > 0 && formik.errors.FirstName && (
                                    <div className="text-danger">
                                        {formik.errors.FirstName}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="LastName">Last Name</label>
                                <input
                                    name="LastName"
                                    type="text"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={formik.values.LastName}
                                />
                                {formik.submitCount > 0 && formik.errors.LastName && (
                                    <div className="text-danger">
                                        {formik.errors.LastName}
                                    </div>
                                )}
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
                                {formik.submitCount > 0 && formik.errors.Username && (
                                    <div className="text-danger">
                                        {formik.errors.Username}
                                    </div>
                                )}
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
                                {formik.submitCount > 0 && formik.errors.EmailID && (
                                    <div className="text-danger">
                                        {formik.errors.EmailID}
                                    </div>
                                )}
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
                                {formik.submitCount > 0 && formik.errors.Password && (
                                    <div className="text-danger">
                                        {formik.errors.Password}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="NfcID">NfcID</label>
                                <input
                                    name="NfcID"
                                    type="password"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={formik.values.NfcID}
                                />
                                {formik.submitCount > 0 && formik.errors.NfcID && (
                                    <div className="text-danger">
                                        {formik.errors.NfcID}
                                    </div>
                                )}
                            </div>

                            <div className="form-group form-check">
                                <input
                                    name="IsAdmin"
                                    type="checkbox"
                                    className="form-check-input"
                                    onChange={formik.handleChange}
                                    checked={formik.values?.IsAdmin === false ? false : true}
                                />
                                <label htmlFor="IsAdmin" className="form-check-label">
                                    Is User an Admin?
                                </label>
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