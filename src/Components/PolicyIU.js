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
import MenuActionMatrix from './Controls/MenuActionMatrix'

function PolicyIU(props) {
    const [getSession, setSession] = useSession()
    const [isVisible, setVisible] = useState(false)
    const [message, setMessage] = useState('')
    const [alertType, setAlertType] = useState('')
    const [selectedPolicies, setSelectedPolicies] = useState([])
    const [existingPolicies, setExistingPolicies] = useState([])
    const [isEditMode, setIsEditMode] = useState(false)

    const validationSchema = Yup.object().shape({
        PreviligeID: Yup.number().min(1, 'Role is required'),
    });

    const formik = useFormik({
        enableReinitialize: true,  // This ensures the form will reinitialize when the userData changes
        validationSchema,
        validateOnChange: true,
        validateOnBlur: false,
        initialValues: {
            PreviligeID: props?.editRow?.FKPreviligeID || -1,
            selectedPolicies: []
        },
        onSubmit: (data) => {
            // Clear any previous messages
            setMessage('');
            
            // Custom validation for selected policies
            if (selectedPolicies.length === 0) {
                setAlertType('danger');
                setMessage('At least one action must be selected');
                return;
            }

            let endpoint, httpMethod, body;

            if (isEditMode) {
                // Update mode - replace all existing policies for this role
                endpoint = 'policy/batch'
                httpMethod = 'put'
                body = {
                    PreviligeID: data.PreviligeID,
                    policies: selectedPolicies
                }
            } else {
                // Create mode - batch create new policies
                endpoint = 'policy/batch'
                httpMethod = 'post'
                body = { policies: selectedPolicies }
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

    // Load existing policies when editing
    useEffect(() => {
        if (props.editRow?.FKPreviligeID > -1) {
            setIsEditMode(true);
            // Load all existing policies for this role
            loadExistingPolicies(props.editRow.FKPreviligeID);
            showModal();
        }
    }, [props.editRow]);

    // Load existing policies for edit mode
    const loadExistingPolicies = (previligeId) => {
        // Get all existing policies for this role across all menus
        FetchData(`policy`, 'get', null, (response) => {
            try {
                const responseData = response?.data || response;
                if (responseData && Array.isArray(responseData.data)) {
                    // Filter policies for the current role
                    const rolePolicies = responseData.data.filter(policy => 
                        policy.FKPreviligeID === previligeId
                    );
                    setExistingPolicies(rolePolicies);
                }
            } catch (error) {
                console.error('Error loading existing policies:', error);
            }
        });
    };

    // Handle policy selection change from matrix
    const handlePolicySelectionChange = (policies) => {
        setSelectedPolicies(policies);
        formik.setFieldValue('selectedPolicies', policies);
        
        // Clear any previous error messages
        if (policies.length > 0) {
            setMessage('');
        }
    };

    const showModal = () => {
        setVisible(true)
        props.handleModalOpen(true);
    };

    const hideModal = (alertType, msg) => {
        // Reset all form and component state
        formik.resetForm();
        setMessage('');
        setSelectedPolicies([]);
        setExistingPolicies([]);
        setIsEditMode(false);
        setVisible(false);
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
                        <ModalTitle>
                            {isEditMode ? 'Update Policy Actions' : 'Add New Policy'}
                        </ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        {message.length <= 0 ? null : <Alert key={alertType} variant={alertType}>
                            {message}
                        </Alert>}

                        <div className="form-group mb-3">
                            <label htmlFor="PreviligeID">Role Name</label>
                            <Dropdown name="PreviligeID"
                                api={getSession()?.isAppDeveloper === true ? `previlige` : `previlige/${getSession()?.schoolID}`}
                                keyField='PreviligeID'
                                valueField='PreviligeName'
                                selectedValue={formik.values.PreviligeID}
                                onChange={value => formik.setFieldValue('PreviligeID', value.value)}
                                disabled={isEditMode}
                            />
                            <div className="text-danger">
                                {formik.errors.PreviligeID ? formik.errors.PreviligeID : null}
                            </div>
                        </div>

                        {formik.values.PreviligeID > 0 && (
                            <div className="form-group mb-3">
                                <MenuActionMatrix
                                    roleId={formik.values.PreviligeID}
                                    schoolId={getSession()?.schoolID}
                                    previligeId={getSession()?.previligeID}
                                    isAppDeveloper={getSession()?.isAppDeveloper === true}
                                    existingPolicies={existingPolicies}
                                    onChange={handlePolicySelectionChange}
                                />
                            </div>
                        )}

                        {isEditMode && (
                            <div className="alert alert-info">
                                <strong>Edit Mode:</strong> You are updating existing policies for this role. 
                                Changes will replace all current policy settings for this role.
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <button type="button" className="btn btn-secondary" onClick={() => hideModal('info', 'Policy operation cancelled by user!')}>
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={selectedPolicies.length === 0}
                        >
                            {isEditMode ? 'Update Policies' : 'Create Policies'}
                        </button>
                    </ModalFooter>
                </form>
            </Modal>
        </>
    )
}

export default PolicyIU;