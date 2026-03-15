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


function PreviligesIU(props) {
    const [getSession] = useSession()
    const [isVisible, setVisible] = useState(false)
    const [message, setMessage] = useState('')
    const [alertType, setAlertType] = useState('')
    const [schoolDropdownKey, setSchoolDropdownKey] = useState(0)

    const validationSchema = Yup.object().shape({
        SchoolID: Yup.number().required('School ID is required'),
        PreviligeName: Yup.string().required('Previlige name is required'),
    });

    const formik = useFormik({
        enableReinitialize: true,  // This ensures the form will reinitialize when the userData changes
        validationSchema,
        validateOnChange: false,
        validateOnBlur: false,
        initialValues: {
            PreviligeID: props?.editRow?.PreviligeID || -1,
            // For School Admins, default to their school; super admins can choose via dropdown
            SchoolID: props?.editRow?.FKSchoolID || getSession()?.schoolID || -1,
            PreviligeName: props?.editRow?.PreviligeName || "",
        },

        onSubmit: (data) => {
            const isEdit = props.editRow?.PreviligeID > 0;
            let httpMethod = isEdit ? 'put' : 'post'
            let endpoint = 'previlige'
            let body = {
                "previlige": {
                    "PreviligeID": isEdit ? props?.editRow?.PreviligeID : null,
                    "PreviligeName": data.PreviligeName,
                    // Ensure School Admins always use their own school ID
                    "SchoolID": getSession()?.isAppDeveloper === false
                        ? getSession()?.schoolID
                        : data.SchoolID,
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

    const showModal = useCallback(() => {
        setSchoolDropdownKey(k => k + 1)
        setVisible(true)
        props.handleModalOpen(true);
    }, [props]);

    const hideModal = (alertType, msg) => {
        formik.resetForm()
        setMessage('')
        setVisible(false)
        props.handleModalClosed(msg, alertType, true);
    };

    useEffect(() => {
        if (props?.editRow?.PreviligeID > -1) {
            showModal()
        }
    }, [props?.editRow?.PreviligeID, showModal])

    return (
        <>
            <button type="button" className="btn btn-primary float-end" onClick={showModal}>
                Add New Role
            </button>
            <Modal show={isVisible} size="lg" dialogClassName={"primaryModal"}>
                <form onSubmit={formik.handleSubmit}>
                    <ModalHeader>
                        <ModalTitle>{props.editRow?.PreviligeID > -1 ? 'Update Existing' : 'Add New'} Role</ModalTitle>
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
                                        onChange={value => formik.setFieldValue('SchoolID', value.value)}
                                        refreshKey={schoolDropdownKey}
                                    />
                                    {formik.submitCount > 0 && formik.errors.SchoolID && (
                                        <div className="text-danger">
                                            {formik.errors.SchoolID}
                                        </div>
                                    )}
                                </div>
                            }
                            <div className="form-group">
                                <label htmlFor="PreviligeName">Role Name</label>
                                <input
                                    name="PreviligeName"
                                    type="text"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={formik.values.PreviligeName}
                                />
                                {formik.submitCount > 0 && formik.errors.PreviligeName && (
                                    <div className="text-danger">
                                        {formik.errors.PreviligeName}
                                    </div>
                                )}
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

export default PreviligesIU;