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

function SchoolsIU(props) {
    const [isVisible, setVisible] = useState(false)

    const validationSchema = Yup.object().shape({
        SchoolName: Yup.string()
            .required('School name is required'),
        Address: Yup.string()
            .required('Address is required'),
    });

    const formik = useFormik({
        initialValues: {
            SchoolID: 0,
            SchoolName: "",
            Address: "",
        },
        validationSchema,
        // validateOnChange: false,
        // validateOnBlur: false,
        onSubmit: (data) => {
            console.log(JSON.stringify(data, null, 2));
            let httpMethod = props.editRow?.SchoolID > 0 ? 'put' : 'post'
            let endpoint = 'http://beyghairat.admee.co.uk:8000/school'
            let body = {
                "school": {
                    "SchoolID": data.SchoolID,
                    "SchoolName": data.SchoolName,
                    "Address": data.Address,
                }
            }


            FetchData(endpoint, httpMethod, body, (result) => {
                hideModal('info', result)
            })
        },

    });

    useEffect(() => {
        if (props.editRow?.SchoolID > -1) {
            formik.initialValues.SchoolID = props.editRow.SchoolID
            formik.initialValues.SchoolName = props.editRow.SchoolName
            formik.initialValues.Address = props.editRow.Address
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

    return (
        <>
            <button type="button" className="btn btn-primary mt-3 float-end" onClick={showModal}>
                Add New School
            </button>
            <Modal show={isVisible} size="lg" dialogClassName={"primaryModal"}>
                <form onSubmit={formik.handleSubmit}>
                    <ModalHeader>
                        <ModalTitle>{props.editRow?.SchoolID > -1 ? 'Update Existing' : 'Add New'} School</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <div className="register-form">
                            
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
                        <button type="button" className="btn btn-secondary" onClick={() => hideModal('info', props.editRow?.SchoolID > -1 ? 'Edit action cancelled by user!' : 'Add action cancelled by user!')}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </ModalFooter>
                </form>
            </Modal>
        </>
    )
}

export default SchoolsIU;