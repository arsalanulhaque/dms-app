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

function DeviceIU(props) {
    const [isVisible, setVisible] = useState(false)

    const validationSchema = Yup.object().shape({
        SchoolID: Yup.number().required('School is required'),
        IMEI: Yup.string()
            .required('IMEI is required'),
        DeviceName: Yup.string()
            .required('Device name is required'),
        Model: Yup.string()
            .required('Model is required'),
        AssetID: Yup.string()
            .required('Asset ID is required'),
    });

    const formik = useFormik({
        initialValues: {
            SchoolID: 0,
            IMEI: "",
            DeviceName: "",
            SchoolName: "",
            Model: "",
            AssetID: "",
            IsIssued: false
        },
        validationSchema,
        // validateOnChange: false,
        // validateOnBlur: false,
        onSubmit: (data) => {
            console.log(JSON.stringify(data, null, 2));
            let httpMethod = props.editRow?.DeviceID > 0 ? 'put' : 'post'
            let endpoint = 'http://localhost:8000/device'
            let body = {
                "device": {
                    "SchoolID": data.SchoolID,
                    "IMEI": data.IMEI,
                    "DeviceName": data.DeviceName,
                    "Model": data.Model,
                    "AssetID": data.AssetID,
                    "IsIssued": data.IsIssued === 'checked' ? 1 : 0,
                    "DeviceID": props?.editRow?.DeviceID
                }
            }


            FetchData(endpoint, httpMethod, body, (result) => {
                hideModal('info', result)
            })
        },

    });

    useEffect(() => {
        if (props.editRow?.DeviceID > -1) {
            formik.initialValues.SchoolID = props.editRow.FKSchoolID
            formik.initialValues.SchoolName = props.editRow.SchoolName
            formik.initialValues.IMEI = props.editRow.IMEI
            formik.initialValues.DeviceName = props.editRow.DeviceName
            formik.initialValues.Model = props.editRow.Model
            formik.initialValues.AssetID = props.editRow.AssetID
            formik.initialValues.IsIssued = props.editRow.IsIssued === 1 ? 'checked' : 'unchecked'
            showModal()
        }
    }, [props, formik.initialValues])

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

    return (
        <>
            <button type="button" className="btn btn-primary mt-3 float-end" onClick={showModal}>
                Add New Device
            </button>
            <Modal show={isVisible} size="lg" dialogClassName={"primaryModal"}>
                <form onSubmit={formik.handleSubmit}>
                    <ModalHeader>
                        <ModalTitle>{props.editRow?.DeviceID > -1 ? 'Update Existing' : 'Add New'} Device</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <div className="register-form">
                            <div className="form-group">
                                <label htmlFor="SchoolID">School Name</label>
                                <Dropdown name="SchoolID"
                                    api="http://localhost:8000/school"
                                    keyField='SchoolID'
                                    valueField='SchoolName'
                                    type="Dropdown"
                                    selectedValue={formik.values.SchoolName}
                                    onChange={onSchoolChange}
                                />
                                <div className="text-danger">
                                    {formik.errors.SchoolID ? formik.errors.SchoolID : null}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="IMEI"> IMEI </label>
                                <input
                                    name="IMEI"
                                    type="text"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={formik.values.IMEI}
                                />
                                <div className="text-danger">
                                    {formik.errors.IMEI ? formik.errors.IMEI : null}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="DeviceName">Device Name</label>
                                <input
                                    name="DeviceName"
                                    type="text"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={formik.values.DeviceName}
                                />
                                <div className="text-danger">
                                    {formik.errors.DeviceName ? formik.errors.DeviceName : null}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="Model"> Model </label>
                                <input
                                    name="Model"
                                    type="text"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={formik.values.Model}
                                />
                                <div className="text-danger">
                                    {formik.errors.Model ? formik.errors.Model : null}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="AssetID"> Asset ID </label>
                                <input
                                    name="AssetID"
                                    type="text"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={formik.values.AssetID}
                                />
                                <div className="text-danger">
                                    {formik.errors.AssetID
                                        ? formik.errors.AssetID
                                        : null}
                                </div>
                            </div>

                            <div className="form-group form-check">
                                <input
                                    name="Issued"
                                    type="checkbox"
                                    className="form-check-input"
                                    onChange={formik.handleChange}
                                    checked={formik.values.IsIssued}
                                />
                                <label htmlFor="Issued" className="form-check-label">
                                    Device Issued Status
                                </label>
                            </div>
                            <div className="form-group">
                                <button
                                    type="reset"
                                    className="btn btn-warning float-right"
                                    onClick={ e => formik.resetForm()}>
                                    Reset
                                </button>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button type="button" className="btn btn-secondary" onClick={() => hideModal('info', 'Action cancelled by user!')}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </ModalFooter>
                </form>
            </Modal>
        </>
    )
}

export default DeviceIU;