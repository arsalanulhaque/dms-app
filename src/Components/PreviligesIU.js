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

function PreviligesIU(props) {
    const [isVisible, setVisible] = useState(false)

    const validationSchema = Yup.object().shape({
        PreviligeName: Yup.string()
            .required('Previlige name is required'),
    });

    const formik = useFormik({
        initialValues: {
            PreviligeID: 0,
            PreviligeName: "",
            IsAdmin: false,
        },
        validationSchema,
        // validateOnChange: false,
        // validateOnBlur: false,
        onSubmit: (data) => {
            console.log(JSON.stringify(data, null, 2));
            let httpMethod = props.editRow?.PreviligeID > 0 ? 'put' : 'post'
            let endpoint = 'http://beyghairat.admee.co.uk:8000/previlige'
            let body = {
                "previlige": {
                    "PreviligeID": data.PreviligeID,
                    "PreviligeName": data.PreviligeName,
                    "IsAdmin": data.IsAdmin,
                }
            }


            FetchData(endpoint, httpMethod, body, (result) => {
                hideModal('info', result)
            })
        },

    });

    useEffect(() => {
        if (props.editRow?.PreviligeID > -1) {
            formik.initialValues.PreviligeID = props.editRow.PreviligeID
            formik.initialValues.PreviligeName = props.editRow.PreviligeName
            formik.initialValues.IsAdmin = props.editRow.IsAdmin
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
                Add New Role
            </button>
            <Modal show={isVisible} size="lg" dialogClassName={"primaryModal"}>
                <form onSubmit={formik.handleSubmit}>
                    <ModalHeader>
                        <ModalTitle>{props.editRow?.PreviligeID > -1 ? 'Update Existing' : 'Add New'} Role</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <div className="register-form">

                            <div className="form-group">
                                <label htmlFor="PreviligeName">Role Name</label>
                                <input
                                    name="PreviligeName"
                                    type="text"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={formik.values.PreviligeName}
                                />
                                <div className="text-danger">
                                    {formik.errors.PreviligeName ? formik.errors.PreviligeName : null}
                                </div>
                            </div>

                            <div className="form-group form-check">
                                <input
                                    name="IsAdmin"
                                    type="checkbox"
                                    className="form-check-input"
                                    onChange={formik.handleChange}
                                    checked={formik.values.IsAdmin}
                                />
                                <label htmlFor="IsAdmin" className="form-check-label">
                                    Is Admin Role?
                                </label>
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

export default PreviligesIU;