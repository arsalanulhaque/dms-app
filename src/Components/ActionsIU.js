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

function ActionsIU(props) {
    const [isVisible, setVisible] = useState(false)
    const [message, setMessage] = useState('')
    const [alertType, setAlertType] = useState('')

    const validationSchema = Yup.object().shape({
        ActionName: Yup.string().required('Action name is required'),
    });

    const formik = useFormik({
        initialValues: {
            ActionID: -1,
            ActionName: "",
        },
        validationSchema,
        validateOnChange: true,
        validateOnBlur: false,
        onSubmit: (data) => {
            let httpMethod = props.editRow?.ActionID > -1 ? 'put' : 'post'
            let endpoint = 'actions'
            let body = {
                "action": {
                    "ActionID": data.ActionID >-1 ? data.ActionID : null,
                    "ActionName": data.ActionName,
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
        if (props.editRow?.ActionID > -1) {
            showModal()
            formik.initialValues.ActionID = props.editRow.ActionID
            formik.initialValues.ActionName = props.editRow.ActionName
        } else {
            formik.initialValues.ActionID = -1
            formik.initialValues.ActionName = ""
        }
    }, [props, isVisible, formik, formik.initialValues])

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
            <button type="button" className="btn btn-primary mt-3 float-end" onClick={showModal}>
                Add New Action
            </button>
            <Modal show={isVisible} size="lg" dialogClassName={"primaryModal"}>
                <form onSubmit={formik.handleSubmit}>
                    <ModalHeader>
                        <ModalTitle>{props.editRow?.ActionID > -1 ? 'Update Existing' : 'Add New'} Action </ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        {message.length <= 0 ? null : <Alert key={alertType} variant={alertType}>
                            {message}
                        </Alert>}
                        <div className="">
                            <div className="form-group">
                                <label htmlFor="ActionName">Action Name</label>
                                <input
                                    name="ActionName"
                                    type="text"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={formik.values.ActionName}
                                />
                                <div className="text-danger">
                                    {formik.errors.ActionName ? formik.errors.ActionName : null}
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

export default ActionsIU;