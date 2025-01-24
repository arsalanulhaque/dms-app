import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalTitle from "react-bootstrap/ModalTitle";
import ModalBody from "react-bootstrap/ModalBody";
import ModalFooter from "react-bootstrap/ModalFooter";
import { useFormik } from "formik";
import * as Yup from 'yup';
import FetchData from '../Hooks/FetchData'
import Alert from 'react-bootstrap/Alert';

function SchoolsIU(props) {
    const [isVisible, setVisible] = useState(false)
    const [message, setMessage] = useState('')
    const [alertType, setAlertType] = useState('')

    const validationSchema = Yup.object().shape({
        SchoolName: Yup.string().required('School name is required'),
        EmailID: Yup.string().email().required('Email is required'),
        Address: Yup.string().required('Address is required'),
    });

    const formik = useFormik({
        enableReinitialize: true,  // This ensures the form will reinitialize when the userData changes
        validationSchema,
        validateOnChange: true,
        validateOnBlur: false,
        initialValues: {
            SchoolID: props?.editRow?.SchoolID || -1,
            SchoolName: props?.editRow?.SchoolName || "",
            Address: props?.editRow?.Address || "",
            EmailID: props?.editRow?.EmailID || "",
        },
        onSubmit: (data) => {
            let httpMethod = props.editRow?.SchoolID > 0 ? 'put' : 'post'
            let endpoint = 'school'
            let body = {
                "school": {
                    "SchoolID": props.editRow?.SchoolID > 0 ? data.SchoolID : null,
                    "SchoolName": data.SchoolName,
                    "Address": data.Address,
                    "EmailID":data.EmailID,
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
        if (props?.editRow?.SchoolID > -1) {
            showModal()
        } 
    }, [props, ])

    const showModal = () => {
        setVisible(true)
        props.handleModalOpen(true);
    };

    const hideModal = (alertType, msg) => {
        formik.resetForm()
        setMessage('')
        setVisible(false)
        props.handleModalClosed(msg, alertType, true);
    };

    return (
        <>
            <button type="button" className="btn btn-primary float-end" onClick={showModal}>
                Add New School
            </button>
            <Modal show={isVisible} size="lg" dialogClassName={"primaryModal"}>
                <form onSubmit={formik.handleSubmit}>
                    <ModalHeader>
                        <ModalTitle>{props.editRow?.SchoolID > -1 ? 'Update Existing' : 'Add New'} School</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        {message.length <= 0 ? null : <Alert key={alertType} variant={alertType}>
                            {message}
                        </Alert>}
                        <div className="">
                            <div className="form-group">
                                <label htmlFor="SchoolName">School Name</label>
                                <input
                                    name="SchoolName"
                                    type="text"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={formik.values.SchoolName}
                                />
                                <div className="text-danger">
                                    {formik.errors.SchoolName ? formik.errors.SchoolName : null}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="EmailID">Email ID</label>
                                <input
                                    name="EmailID"
                                    type="email"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={formik.values.EmailID}
                                />
                                <div className="text-danger">
                                    {formik.errors.EmailID ? formik.errors.EmailID : null}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="Address">Address</label>
                                <input
                                    name="Address"
                                    type="text"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={formik.values.Address}
                                />
                                <div className="text-danger">
                                    {formik.errors.Address ? formik.errors.Address : null}
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

export default SchoolsIU;