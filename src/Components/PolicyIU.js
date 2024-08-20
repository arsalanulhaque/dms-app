import { useEffect, useState, useContext } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalTitle from "react-bootstrap/ModalTitle";
import ModalBody from "react-bootstrap/ModalBody";
import Dropdown from './Controls/Dropdown'
import ModalFooter from "react-bootstrap/ModalFooter";
import { useFormik } from "formik";
import * as Yup from 'yup';
import FetchData from '../Hooks/FetchData'
import Alert from 'react-bootstrap/Alert';
import useSession from '../Context/SessionContext'

function PolicyIU(props) {
   const [getSession, setSession] = useSession()
    const [menuID, setMenuID] = useState(-1)
    const [isVisible, setVisible] = useState(false)
    const [message, setMessage] = useState('')
    const [alertType, setAlertType] = useState('')

    const validationSchema = Yup.object().shape({
        PreviligeID: Yup.number().min(1, 'Previlige is required'),
        PreviligeMenuID: Yup.number().min(1, 'Menu is required'),
        PreviligeActionID: Yup.number().min(1, 'Action is required'),
    });

    const formik = useFormik({
        initialValues: {
            PreviligeMenuActionsID: -1,
            PreviligeID: -1,
            PreviligeMenuID: -1,
            PreviligeActionID: -1
        },
        validationSchema,
        validateOnChange: true,
        validateOnBlur: false,
        onSubmit: (data) => {
            let httpMethod = props.editRow?.PreviligeMenuActionsID > -1 ? 'put' : 'post'
            let endpoint = 'policy'
            let body = {
                "pma": {
                    "PreviligeMenuActionsID": data.PreviligeMenuActionsID,
                    "PreviligeID": data.PreviligeID,
                    "PreviligeMenuID": data.PreviligeMenuID,
                    "PreviligeActionID": data.PreviligeActionID
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
        if (props.editRow?.PreviligeMenuActionsID > -1) {
            showModal()
            formik.initialValues.PreviligeMenuActionsID = props.editRow.PreviligeMenuActionsID
            formik.initialValues.PreviligeID = props.editRow.FKPreviligeID
            formik.initialValues.PreviligeMenuID = props.editRow.FKPreviligeMenuID
            formik.initialValues.PreviligeActionID = props.editRow.FKPreviligeActionID 
        } else {
            formik.initialValues.PreviligeMenuActionsID = -1
            formik.initialValues.PreviligeID = -1
            formik.initialValues.PreviligeMenuID = -1
            formik.initialValues.PreviligeActionID = -1
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
            <button type="button" className="btn btn-primary float-end" onClick={showModal}>
                Add New Policy
            </button>
            <Modal show={isVisible} size="lg" dialogClassName={"primaryModal"}>
                <form onSubmit={formik.handleSubmit}>
                    <ModalHeader>
                        <ModalTitle>{props.editRow?.MenuID > -1 ? 'Update Existing' : 'Add New'} Menu </ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        {message.length <= 0 ? null : <Alert key={alertType} variant={alertType}>
                            {message}
                        </Alert>}

                        <div className="form-group">
                            <label htmlFor="PreviligeID">Role Name</label>
                            <Dropdown name="PreviligeID"
                                api={getSession()?.isAppDeveloper === true ? `previlige` : `previlige/${getSession()?.schoolID}`}
                                keyField='PreviligeID'
                                valueField='PreviligeName'
                                selectedValue={formik.values.PreviligeID}
                                onChange={value => formik.setFieldValue('PreviligeID', value.value)}
                            />
                            <div className="text-danger">
                                {formik.errors.PreviligeID ? formik.errors.PreviligeID : null}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="PreviligeMenuID">Menu Name</label>
                            <Dropdown name="PreviligeMenuID"
                                api={getSession()?.isAppDeveloper === true ? `menus` : `menus/${getSession()?.schoolID}/${getSession()?.previligeID}`}
                                keyField='MenuID'
                                valueField='MenuName'
                                selectedValue={formik.values.PreviligeMenuID}
                                onChange={value => {
                                    formik.setFieldValue('PreviligeMenuID', value.value)
                                    setMenuID(value.value)
                                }}
                            />
                            <div className="text-danger">
                                {formik.errors.PreviligeMenuID ? formik.errors.PreviligeMenuID : null}
                            </div>
                        </div>
                        {menuID < 1 ? <></> :
                            <div className="form-group">
                                <label htmlFor="PreviligeActionID">Action Name</label>
                                <Dropdown name="PreviligeActionID"
                                    api={getSession()?.isAppDeveloper === true ? `actions` : `actions/${menuID}`}
                                    keyField='ActionID'
                                    valueField='ActionName'
                                    selectedValue={formik.values.PreviligeActionID}
                                    onChange={value => formik.setFieldValue('PreviligeActionID', value.value)}
                                />
                                <div className="text-danger">
                                    {formik.errors.PreviligeActionID ? formik.errors.PreviligeActionID : null}
                                </div>
                            </div>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <button type="reset" className="btn btn-warning" onClick={formik.handleReset}>Reset</button>
                        <button type="button" className="btn btn-secondary" onClick={() => hideModal('info', 'Menu cancelled by user!')}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </ModalFooter>
                </form>
            </Modal>
        </>
    )
}

export default PolicyIU;