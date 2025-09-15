import React, { useEffect, useState } from 'react';
import FetchData from '../../Hooks/FetchData';

function ActionCheckboxes(props) {
    const [availableActions, setAvailableActions] = useState([]);
    const [selectedActions, setSelectedActions] = useState([]);

    // Define action rules for different menus
    const getActionRules = (menuName) => {
        const menuNameLower = menuName?.toLowerCase();
        
        switch (menuNameLower) {
            case 'home':
                return {
                    allowedActions: ['Read', 'Issue Device', 'Unissue Device'],
                    description: 'Home menu actions'
                };
            case 'device bulk upload':
            case 'devicebulkupload':
                return {
                    allowedActions: ['Read', 'Import'],
                    description: 'Device bulk upload actions'
                };
            default:
                return {
                    allowedActions: ['Create', 'Read', 'Update', 'Delete'],
                    description: 'Standard CRUD actions'
                };
        }
    };

    // Fetch actions and menu details when menu changes
    useEffect(() => {
        if (!props.menuId || props.menuId <= 0) {
            setAvailableActions([]);
            setSelectedActions([]);
            return;
        }

        // Get all actions for the menu
        FetchData(`actions/${props.menuId}`, 'get', null, (response) => {
            try {
                const responseData = response?.data || response;
                if (!responseData) {
                    console.error('No data in response:', response);
                    return;
                }

                const dataArray = Array.isArray(responseData) ? responseData : responseData.data;
                if (Array.isArray(dataArray) && dataArray.length > 0) {
                    // Get menu name from the first action's data (it should contain MenuName)
                    const menuName = dataArray[0]?.MenuName || props.menuName || '';
                    
                    // Filter actions based on menu rules
                    const rules = getActionRules(menuName);
                    const filteredActions = dataArray.filter(action => 
                        rules.allowedActions.includes(action.ActionName)
                    );
                    
                    setAvailableActions(filteredActions);
                    
                    // Set initial selected actions from props (for edit mode)
                    if (props.initialSelectedActions && props.initialSelectedActions.length > 0) {
                        setSelectedActions(props.initialSelectedActions);
                    } else {
                        setSelectedActions([]);
                    }
                } else {
                    console.error('Response data is not an array or is empty:', dataArray);
                    setAvailableActions([]);
                }
            } catch (error) {
                console.error('Error processing actions data:', error);
                setAvailableActions([]);
            }
        });
    }, [props.menuId, props.menuName, props.initialSelectedActions]);

    // Handle checkbox change
    const handleActionChange = (actionId, isChecked) => {
        let newSelectedActions;
        if (isChecked) {
            newSelectedActions = [...selectedActions, actionId];
        } else {
            newSelectedActions = selectedActions.filter(id => id !== actionId);
        }
        
        setSelectedActions(newSelectedActions);
        
        // Notify parent component
        if (props.onChange) {
            props.onChange(newSelectedActions);
        }
    };

    // Handle select all / deselect all
    const handleSelectAll = (selectAll) => {
        const newSelectedActions = selectAll ? availableActions.map(action => action.ActionID) : [];
        setSelectedActions(newSelectedActions);
        
        if (props.onChange) {
            props.onChange(newSelectedActions);
        }
    };

    if (!props.menuId || props.menuId <= 0) {
        return (
            <div className="alert alert-info">
                Please select a menu first to see available actions.
            </div>
        );
    }

    if (availableActions.length === 0) {
        return (
            <div className="alert alert-warning">
                No actions available for this menu.
            </div>
        );
    }

    const rules = getActionRules(props.menuName);
    const allSelected = availableActions.length > 0 && selectedActions.length === availableActions.length;

    return (
        <div className="action-checkboxes">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <label className="form-label fw-bold">
                    Available Actions
                    <small className="text-muted d-block">{rules.description}</small>
                </label>
                <div>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleSelectAll(true)}
                        disabled={allSelected}
                    >
                        Select All
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleSelectAll(false)}
                        disabled={selectedActions.length === 0}
                    >
                        Clear All
                    </button>
                </div>
            </div>

            <div className="row">
                {availableActions.map((action) => (
                    <div key={action.ActionID} className="col-md-6 mb-2">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`action-${action.ActionID}`}
                                checked={selectedActions.includes(action.ActionID)}
                                onChange={(e) => handleActionChange(action.ActionID, e.target.checked)}
                            />
                            <label 
                                className="form-check-label" 
                                htmlFor={`action-${action.ActionID}`}
                            >
                                {action.ActionName}
                            </label>
                        </div>
                    </div>
                ))}
            </div>

            {selectedActions.length > 0 && (
                <div className="alert alert-success mt-3">
                    <strong>{selectedActions.length}</strong> action{selectedActions.length !== 1 ? 's' : ''} selected. 
                    This will create {selectedActions.length} policy row{selectedActions.length !== 1 ? 's' : ''}.
                </div>
            )}

            {props.error && (
                <div className="text-danger mt-2">
                    {props.error}
                </div>
            )}
        </div>
    );
}

export default ActionCheckboxes;
