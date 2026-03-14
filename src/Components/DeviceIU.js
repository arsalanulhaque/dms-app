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
import useSession from '../Context/SessionContext'

function DeviceIU(props) {
    const [getSession] = useSession()
    const [isVisible, setVisible] = useState(false)
    const [message, setMessage] = useState('')
    const [alertType, setAlertType] = useState('')

    const validationSchema = Yup.object().shape({
        // SchoolID: Yup.number().min(1, 'School is required'),
        IMEI: Yup.string().required('IMEI / MAC address is required'),
        DeviceName: Yup.string().required('Device name is required'),
        Model: Yup.string().required('Model is required'),
        AssetID: Yup.string().required('Asset ID is required'),
        BarCode: Yup.string().min(6, 'Minimum 6 characters long Bar Code are allowed')
    });

    const formik = useFormik({
        enableReinitialize: true,  // This ensures the form will reinitialize when the userData changes
        validationSchema,
        validateOnChange: false,
        validateOnBlur: false,
        initialValues: {
            SchoolID: props?.editRow?.FKSchoolID || getSession().schoolID,
            IMEI: props?.editRow?.MacAddress || "",
            DeviceName: props?.editRow?.DeviceName || "",
            SchoolName: "",
            Model: props?.editRow?.Model || "",
            AssetID: props?.editRow?.AssetID || "",
            BarCode: props?.editRow?.BarCode || "",
            IsIssued: props?.editRow?.IsIssued === 1 ? true : false,
        },
        onSubmit: (data) => {
            let httpMethod = props.editRow?.DeviceID > 0 ? 'put' : 'post'
            let endpoint = 'device'
            let body = {
                "device": {
                    "DeviceID": props?.editRow?.DeviceID > 0 ? props?.editRow?.DeviceID : null,
                    "SchoolID": formik.values.SchoolID,
                    "IMEI": data.IMEI,
                    "DeviceName": data.DeviceName,
                    "Model": data.Model,
                    "AssetID": data.AssetID,
                    "BarCode": data.BarCode,
                    "IsIssued": data.IsIssued === true ? 1 : 0,
                }
            }

            FetchData(endpoint, httpMethod, body, (result) => {
                const response = result?.data || result;

                if (!response?.error) {
                    hideModal(response?.error === true ? 'danger' : 'success', response?.message)
                } else {
                    // Provide user-friendly messages for common DB constraint errors
                    const rawMessage = response?.message || '';
                    let friendly = 'Unable to save device. Please try again.';

                    if (/duplicate/i.test(rawMessage) && /asset/i.test(rawMessage)) {
                        friendly = 'This Asset ID is already in use. Please enter a unique Asset ID.';
                    } else if (/duplicate/i.test(rawMessage) && /(mac|imei)/i.test(rawMessage)) {
                        friendly = 'This MAC address is already in use. Each device must have a unique MAC address.';
                    }

                    setAlertType('danger')
                    setMessage(friendly)
                }
            })
        },

    });

    const showModal = () => {
        setVisible(true)
        props.handleModalOpen(true);
    }

    const hideModal = (alertType, msg) => {
        formik.resetForm()
        setMessage('')
        setVisible(false)
        props.handleModalClosed(msg, alertType, true);
    }

    useEffect(() => {
        if (props.editRow?.DeviceID > -1) {
            showModal()
        }
        console.log(formik.values)
    }, [props.editRow?.DeviceID, formik])


    return (
        <>
            <button type="button" className="btn btn-primary float-end" onClick={showModal}>
                Add New Device
            </button>
            <Modal show={isVisible} size="lg" dialogClassName={"primaryModal"}>
                <form onSubmit={formik.handleSubmit}>
                    <ModalHeader>
                        <ModalTitle>{props.editRow?.DeviceID > -1 ? 'Update Existing' : 'Add New'} Device</ModalTitle>
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
                                    />
                                    {formik.submitCount > 0 && formik.errors.SchoolID && (
                                        <div className="text-danger">
                                            {formik.errors.SchoolID}
                                        </div>
                                    )}
                                </div>
                            }
                            <div className="form-group">
                                <label htmlFor="IMEI">IMEI</label>
                                <input
                                    name="IMEI"
                                    type="text"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={formik.values.IMEI}
                                />
                                {formik.submitCount > 0 && formik.errors.IMEI && (
                                    <div className="text-danger">
                                        {formik.errors.IMEI}
                                    </div>
                                )}
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
                                {formik.submitCount > 0 && formik.errors.DeviceName && (
                                    <div className="text-danger">
                                        {formik.errors.DeviceName}
                                    </div>
                                )}
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
                                {formik.submitCount > 0 && formik.errors.Model && (
                                    <div className="text-danger">
                                        {formik.errors.Model}
                                    </div>
                                )}
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
                                {formik.submitCount > 0 && formik.errors.AssetID && (
                                    <div className="text-danger">
                                        {formik.errors.AssetID}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="BarCode"> Bar Code </label>
                                <input
                                    name="BarCode"
                                    type="text"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={formik.values.BarCode}
                                />
                                {formik.submitCount > 0 && formik.errors.BarCode && (
                                    <div className="text-danger">
                                        {formik.errors.BarCode}
                                    </div>
                                )}
                            </div>

                            <div className="form-group form-check">
                                <input
                                    name="IsIssued"
                                    type="checkbox"
                                    className="form-check-input"
                                    onChange={formik.handleChange}
                                    checked={formik.values?.IsIssued === false ? false : true}
                                />
                                <label htmlFor="IsIssued" className="form-check-label">
                                    Device Issued Status
                                </label>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button type="reset" className="btn btn-warning" onClick={formik.resetForm}>Reset</button>
                        <button type="button" className="btn btn-secondary" onClick={() => hideModal('info', 'Action cancelled by user!')}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </ModalFooter>
                </form>
            </Modal>
        </>
    )
}

export default DeviceIU;