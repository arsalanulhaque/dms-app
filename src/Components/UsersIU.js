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

function UsersIU(props) {
    const [isVisible, setVisible] = useState(false)

    const validationSchema = Yup.object().shape({
        SchoolID: Yup.number().required('School ID is required'),
        EmailID: Yup.string().required('Email ID is required'),
        Username: Yup.string().required('User name is required'),
        Password: Yup.string().required('Password is required'),
        PreviligeID: Yup.number().required('Previlige ID is required'),
    });

    const formik = useFormik({
        initialValues: {
            SchoolID: 0,
            SchoolName: "",
            EmailID: "",
            Username: "",
            Password: "",
            PreviligeID: 0,
            PreviligeName: "",
        },
        validationSchema,
        // validateOnChange: false,
        // validateOnBlur: false,
        onSubmit: (data) => {
            console.log(JSON.stringify(data, null, 2));
            let httpMethod = props.editRow?.UserID > 0 ? 'put' : 'post'
            let endpoint = 'http://localhost:8000/users'
            let body = {
                "user": {
                    "UserID": props.editRow.UserID,
                    "SchoolID": data.SchoolID,
                    "PreviligeID": data.PreviligeID,
                    "EmailID": data.EmailID,
                    "Username": data.Username,
                    "Password": data.Password,
                }
            }


            FetchData(endpoint, httpMethod, body, (result) => {
                hideModal('info', result)
            })
        },

    });

    useEffect(() => {
        if (props.editRow?.UserID > -1) {
            formik.initialValues.SchoolID = props.editRow.UserSchoolID
            formik.initialValues.SchoolName = props.editRow.SchoolName
            formik.initialValues.PreviligeID = props.editRow.UserPreviligeID
            formik.initialValues.PreviligeName = props.editRow.PreviligeName
            formik.initialValues.EmailID = props.editRow.EmailID
            formik.initialValues.Username = props.editRow.Username
            formik.initialValues.Password = props.editRow.Password
            showModal()
        }
    }, [props])

    const showModal = () => {
        setVisible(true)
    };

    const hideModal = (alertType, msg) => {
        setVisible(false)
        props.handleModalClosed(msg, alertType, true);
    };

    const onSchoolChange = (e) => {
        formik.initialValues.SchoolID = e.target.selectedOptions[0].id
    }

    const onPreviligeChange = (e) => {
        formik.initialValues.PreviligeID = e.target.selectedOptions[0].id
    }

    return (
        <>
            <button type="button" className="btn btn-primary mt-3 float-end" onClick={showModal}>
                Add New User
            </button>
            <Modal show={isVisible} size="lg" dialogClassName={"primaryModal"}>
                <form onSubmit={formik.handleSubmit}>
                    <ModalHeader>
                        <ModalTitle>{props.editRow?.UserID > -1 ? 'Update Existing' : 'Add New'} User</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <div className="register-form">
                            <div className="form-group">
                                <label htmlFor="SchoolName">School Name</label>
                                <Dropdown name="SchoolName"
                                    api="http://localhost:8000/school"
                                    keyField='SchoolID'
                                    valueField='SchoolName'
                                    type="text"
                                    selectedValue={formik.values.SchoolName}
                                    onChange={onSchoolChange}
                                />
                                <div className="text-danger">
                                    {formik.errors.SchoolName ? formik.errors.SchoolName : null}
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
                                <label htmlFor="Password">Password</label>
                                <input
                                    name="Password"
                                    type="password"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={formik.values.Password}
                                />
                                <div className="text-danger">
                                    {formik.errors.Password ? formik.errors.Password : null}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="PreviligeName">Role Name</label>
                                <Dropdown name="PreviligeName"
                                    api="http://localhost:8000/previlige"
                                    keyField='PreviligeID'
                                    valueField='PreviligeName'
                                    type="text"
                                    selectedValue={formik.values.PreviligeName}
                                    onChange={onPreviligeChange}
                                />
                                <div className="text-danger">
                                    {formik.errors.PreviligeName ? formik.errors.PreviligeName : null}
                                </div>
                            </div>

                            <div className="form-group">
                                <button
                                    type="button"
                                    className="btn btn-warning float-right"
                                    onClick={formik.handleReset}
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button type="button" className="btn btn-secondary" onClick={() => hideModal('info', props.editRow?.UserID > -1 ? 'Edit action cancelled by user!' : 'Add action cancelled by user!')}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </ModalFooter>
                </form>
            </Modal>
        </>
    )
}

export default UsersIU;