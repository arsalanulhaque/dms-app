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

function MenusIU(props) {
    const [isVisible, setVisible] = useState(false)
    const [message, setMessage] = useState('')
    const [alertType, setAlertType] = useState('')

    const validationSchema = Yup.object().shape({
        MenuName: Yup.string().required('Menu name is required'),
        Url: Yup.string().required('Url is required'),
    });

    const formik = useFormik({
        enableReinitialize: true,  // This ensures the form will reinitialize when the userData changes
        validationSchema,
        validateOnChange: true,
        validateOnBlur: false,
        initialValues: {
            MenuID: props?.editRow?.MenuID || -1,
            MenuName: props?.editRow?.MenuName || "",
            Url: props?.editRow?.URL || "",
            Icon: props?.editRow?.Icon || ""
        },
        onSubmit: (data) => {
            let httpMethod = props.editRow?.MenuID > -1 ? 'put' : 'post'
            let endpoint = 'menus'
            let body = {
                "menu": {
                    "MenuID": props?.editRow?.MenuID > 0 ? props?.editRow?.MenuID : null,
                    "MenuName": data.MenuName,
                    "Url": data.Url,
                    "Icon": data.Icon
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
        if (props.editRow?.MenuID > -1) {
            showModal()
        }
    }, [props])

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
                Add New Menu
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
                        <div className="">
                            <div className="form-group">
                                <label htmlFor="MenuName">Menu Name</label>
                                <input
                                    name="MenuName"
                                    type="text"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={formik.values.MenuName}
                                />
                                <div className="text-danger">
                                    {formik.errors.MenuName ? formik.errors.MenuName : null}
                                </div>
                            </div>

                        </div>

                        <div className="">
                            <div className="form-group">
                                <label htmlFor="Url">Url</label>
                                <input
                                    name="Url"
                                    type="text"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={formik.values.Url}
                                />
                                <div className="text-danger">
                                    {formik.errors.Url ? formik.errors.Url : null}
                                </div>
                            </div>
                        </div>

                        <div className="">
                            <div className="form-group">
                                <label htmlFor="Icon">Icon</label>
                                <input
                                    name="Icon"
                                    type="text"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={formik.values.Icon}
                                />
                                <div className="text-danger">
                                    {formik.errors.Icon ? formik.errors.Icon : null}
                                </div>
                            </div>
                        </div>
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

export default MenusIU;