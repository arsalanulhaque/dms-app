import React, { useEffect, useState } from 'react';
import FetchData from '../../Hooks/FetchData';

function MenuActionMatrix(props) {
    const { roleId, onChange } = props;
    const [menus, setMenus] = useState([]);
    const [menuActions, setMenuActions] = useState({});
    const [selectedPolicies, setSelectedPolicies] = useState({});
    const [loading, setLoading] = useState(true);

    // Define action rules for different menus
    const getActionRules = (menuName) => {
        const menuNameLower = menuName?.toLowerCase();
        
        // Check for Home menu
        if (menuNameLower === 'home') {
            return {
                description: 'Home menu: Unissue Device, Issue Device, Read'
            };
        }
        
        // Check for Device-Bulk Upload menu
        if (menuNameLower.includes('bulk') || 
            menuNameLower.includes('upload') || 
            menuNameLower === 'devices - bulk upload' ||
            menuNameLower === 'device bulk upload' ||
            menuNameLower === 'device-bulk upload') {
            return {
                description: 'Device bulk upload: Import Device'
            };
        }
        
        // Default CRUD actions for all other menus
        return {
            description: ''
        };
    };


    // Load existing policies for edit mode - SIMPLE VERSION
    const loadExistingPolicies = (existingPolicies) => {
        console.log('Processing existing policies:', existingPolicies?.length || 0, 'policies');
        const policiesMap = {};
        
        if (!existingPolicies || existingPolicies.length === 0) {
            setSelectedPolicies({});
            return;
        }
        
        existingPolicies.forEach((policy) => {
            // Handle both possible field naming conventions
            const menuId = policy.FKPreviligeMenuID || policy.PreviligeMenuID;
            const actionId = policy.FKPreviligeActionID || policy.PreviligeActionID;
            
            if (menuId && actionId) {
                const key = `${menuId}-${actionId}`;
                policiesMap[key] = true;
            }
        });
        
        console.log('Pre-checking', Object.keys(policiesMap).length, 'policies');
        setSelectedPolicies(policiesMap);
        
        // Notify parent - ONLY ONCE
        if (onChange) {
            const currentPolicies = Object.keys(policiesMap).map(key => {
                const [menuId, actionId] = key.split('-').map(Number);
                return {
                    PreviligeID: roleId,
                    PreviligeMenuID: menuId,
                    PreviligeActionID: actionId
                };
            });
            onChange(currentPolicies);
        }
    };

    // Load existing policies for a specific role - SIMPLE VERSION
    const loadExistingPoliciesForRole = (targetRoleId) => {
        console.log('Fetching policies for role:', targetRoleId);
        
        FetchData('policy', 'get', null, (response) => {
            try {
                const responseData = response?.data || response;
                let rolePolicies = [];
                
                if (responseData && Array.isArray(responseData.data)) {
                    rolePolicies = responseData.data.filter(policy => 
                        policy.FKPreviligeID === targetRoleId
                    );
                } else if (responseData && Array.isArray(responseData)) {
                    rolePolicies = responseData.filter(policy => 
                        policy.FKPreviligeID === targetRoleId
                    );
                }
                
                console.log('Found', rolePolicies.length, 'existing policies for role', targetRoleId);
                loadExistingPolicies(rolePolicies);
                
            } catch (error) {
                console.error('Error loading existing policies for role:', error);
                setSelectedPolicies({});
            }
        });
    };

    // Load menus and their actions
    useEffect(() => {
        if (!props.roleId || props.roleId <= 0) {
            setMenus([]);
            setMenuActions({});
            setSelectedPolicies({});
            setLoading(false);
            return;
        }

        setLoading(true);
        // Reset selected policies when role changes
        setSelectedPolicies({});
        
        // Get all menus - use the general endpoint to get all available menus
        const menuApi = 'menus';
        FetchData(menuApi, 'get', null, (menuResponse) => {
            try {
                const menuData = menuResponse?.data || menuResponse;
                const menuArray = Array.isArray(menuData) ? menuData : menuData?.data || [];
                
                if (menuArray.length === 0) {
                    setMenus([]);
                    setLoading(false);
                    return;
                }

                console.log('Loading menus:', menuArray.map(m => `${m.MenuName} (ID: ${m.MenuID})`));
                setMenus(menuArray);

                // For each menu, get its actions
                const actionPromises = menuArray.map(menu => {
                    return new Promise((resolve) => {
                        FetchData(`actions/${menu.MenuID}`, 'get', null, (actionResponse) => {
                            try {
                                const actionData = actionResponse?.data || actionResponse;
                                const actionArray = Array.isArray(actionData) ? actionData : actionData?.data || [];
                                
                                // Debug: Show what actions are available for each menu
                                console.log(`Menu "${menu.MenuName}" has actions:`, actionArray.map(a => a.ActionName));
                                
                                // Get rules for this menu
                                const rules = getActionRules(menu.MenuName);
                                const menuNameLower = menu.MenuName?.toLowerCase();
                                
                                // Apply filtering based on menu type
                                let filteredActions = [];
                                
                                if (menuNameLower === 'home') {
                                    // Home menu: Show Issue Device, Unissue Device, and Read/Retrieve
                                    console.log('Processing Home menu actions:', actionArray.map(a => a.ActionName));
                                    
                                    actionArray.forEach(action => {
                                        const actionLower = action.ActionName?.toLowerCase();
                                        console.log(`Checking action "${action.ActionName}" (${actionLower})`);
                                        
                                        if (actionLower.includes('issue') && !actionLower.includes('unissue')) {
                                            console.log('✓ Adding Issue Device action');
                                            filteredActions.push(action);
                                        } else if (actionLower.includes('unissue')) {
                                            console.log('✓ Adding Unissue Device action');
                                            filteredActions.push(action);
                                        } else if (actionLower === 'retrieve' || actionLower === 'read' || actionLower.includes('read') || actionLower.includes('retrieve')) {
                                            console.log('✓ Adding Read action');
                                            filteredActions.push(action);
                                        } else {
                                            console.log('✗ Action does not match Home menu criteria');
                                        }
                                    });
                                    
                                    // If no Read action found, let's add any action that could be Read
                                    const hasReadAction = filteredActions.some(a => {
                                        const aLower = a.ActionName?.toLowerCase();
                                        return aLower === 'retrieve' || aLower === 'read' || aLower.includes('read') || aLower.includes('retrieve');
                                    });
                                    
                                    if (!hasReadAction) {
                                        console.log('No Read action found, checking for any possible Read action...');
                                        // Look for any action that could be considered "Read"
                                        let foundAlternative = false;
                                        actionArray.forEach(action => {
                                            const actionLower = action.ActionName?.toLowerCase();
                                            if (actionLower.includes('get') || actionLower.includes('view') || actionLower.includes('show') || actionLower.includes('list')) {
                                                console.log(`Adding "${action.ActionName}" as Read action`);
                                                filteredActions.push(action);
                                                foundAlternative = true;
                                            }
                                        });
                                        
                                        // If still no Read action found, create a virtual one
                                        if (!foundAlternative) {
                                            console.log('Creating virtual Read action for Home menu');
                                            filteredActions.push({
                                                ActionID: 'home-read-virtual',
                                                ActionName: 'Read',
                                                MenuID: menu.MenuID
                                            });
                                        }
                                    }
                                } else if (menuNameLower.includes('bulk') || menuNameLower.includes('upload')) {
                                    // Device Bulk Upload: Show Create (as Import Device) and Read/Retrieve
                                    actionArray.forEach(action => {
                                        const actionLower = action.ActionName?.toLowerCase();
                                        if (actionLower === 'create' || actionLower === 'retrieve' || actionLower === 'read') {
                                            filteredActions.push(action);
                                        }
                                    });
                                } else {
                                    // All other menus: Show Create, Read/Retrieve, Update, Delete
                                    actionArray.forEach(action => {
                                        const actionLower = action.ActionName?.toLowerCase();
                                        if (actionLower === 'create' || actionLower === 'retrieve' || actionLower === 'read' || 
                                            actionLower === 'update' || actionLower === 'delete') {
                                            filteredActions.push(action);
                                        }
                                    });
                                }
                                
                                console.log(`Menu "${menu.MenuName}" filtered actions:`, filteredActions.map(a => a.ActionName));
                                
                                resolve({
                                    menuId: menu.MenuID,
                                    actions: filteredActions,
                                    rules: rules
                                });
                            } catch (error) {
                                console.error(`Error loading actions for menu ${menu.MenuID}:`, error);
                                resolve({ menuId: menu.MenuID, actions: [], rules: getActionRules(menu.MenuName) });
                            }
                        });
                    });
                });

                // Wait for all action requests to complete
                Promise.all(actionPromises).then(results => {
                    const actionsMap = {};
                    results.forEach(result => {
                        actionsMap[result.menuId] = {
                            actions: result.actions,
                            rules: result.rules
                        };
                    });
                    setMenuActions(actionsMap);
                    setLoading(false);
                });

            } catch (error) {
                console.error('Error loading menus:', error);
                setMenus([]);
                setLoading(false);
            }
        });
    }, [props.roleId, props.schoolId, props.previligeId, props.isAppDeveloper]);

    // SIMPLE useEffect for loading existing policies - NO DEPENDENCIES TO AVOID LOOPS
    useEffect(() => {
        if (!props.roleId || props.roleId <= 0) {
            setSelectedPolicies({});
            return;
        }

        console.log('Loading existing policies for role:', props.roleId);
        
        // Load policies - prioritize props
        if (props.existingPolicies && props.existingPolicies.length > 0) {
            console.log('Using existing policies from props');
            loadExistingPolicies(props.existingPolicies);
        } else {
            console.log('Fetching from API');
            loadExistingPoliciesForRole(props.roleId);
        }
    }, [props.roleId]); // ONLY roleId dependency

    // Handle checkbox change - ULTRA SIMPLE
    const handleActionChange = (menuId, actionId, isChecked) => {
        const key = `${menuId}-${actionId}`;
        const newSelectedPolicies = { ...selectedPolicies };
        
        if (isChecked) {
            newSelectedPolicies[key] = true;
        } else {
            delete newSelectedPolicies[key];
        }
        
        // Update state immediately
        setSelectedPolicies(newSelectedPolicies);
        
        // Notify parent with simple array
        if (onChange) {
            const policies = Object.keys(newSelectedPolicies).map(key => {
                const [menuId, actionId] = key.split('-').map(Number);
                return {
                    PreviligeID: roleId,
                    PreviligeMenuID: menuId,
                    PreviligeActionID: actionId
                };
            });
            onChange(policies);
        }
    };

    // Handle select all for a menu - ULTRA SIMPLE
    const handleMenuSelectAll = (menuId, selectAll) => {
        const menuActionsData = menuActions[menuId];
        if (!menuActionsData) return;

        const newSelectedPolicies = { ...selectedPolicies };
        
        menuActionsData.actions.forEach(action => {
            const key = `${menuId}-${action.ActionID}`;
            if (selectAll) {
                newSelectedPolicies[key] = true;
            } else {
                delete newSelectedPolicies[key];
            }
        });
        
        setSelectedPolicies(newSelectedPolicies);
        
        // Notify parent
        if (onChange) {
            const policies = Object.keys(newSelectedPolicies).map(key => {
                const [menuId, actionId] = key.split('-').map(Number);
                return {
                    PreviligeID: roleId,
                    PreviligeMenuID: menuId,
                    PreviligeActionID: actionId
                };
            });
            onChange(policies);
        }
    };

    if (loading) {
        return (
            <div className="text-center p-4">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="mt-2">Loading menus and actions...</div>
            </div>
        );
    }

    if (!props.roleId || props.roleId <= 0) {
        return (
            <div className="alert alert-info">
                Please select a role first to see available menus and actions.
            </div>
        );
    }

    if (menus.length === 0) {
        return (
            <div className="alert alert-warning">
                No menus available for this role.
            </div>
        );
    }

    const totalSelected = Object.keys(selectedPolicies).length;

    return (
        <div className="menu-action-matrix">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h6 className="mb-1">Menu Actions Configuration</h6>
                    <small className="text-muted">
                        Select actions for each menu. {totalSelected} polic{totalSelected !== 1 ? 'ies' : 'y'} will be created.
                    </small>
                </div>
            </div>

            <div className="menu-matrix-container" style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '0.375rem' }}>
                {menus.map((menu) => {
                    const menuActionsData = menuActions[menu.MenuID];
                    
                    // Show menu even if no actions are loaded yet or no actions available
                    if (!menuActionsData) {
                        return (
                            <div key={menu.MenuID} className="menu-section border-bottom p-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div>
                                        <h6 className="mb-1">{menu.MenuName}</h6>
                                        <small className="text-muted">Loading actions...</small>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    
                    if (menuActionsData.actions.length === 0) {
                        return (
                            <div key={menu.MenuID} className="menu-section border-bottom p-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div>
                                        <h6 className="mb-1">{menu.MenuName}</h6>
                                        <small className="text-muted">No actions available for this menu</small>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    const menuSelectedCount = menuActionsData.actions.filter(action => 
                        selectedPolicies[`${menu.MenuID}-${action.ActionID}`]
                    ).length;
                    const allMenuSelected = menuSelectedCount === menuActionsData.actions.length;

                    return (
                        <div key={menu.MenuID} className="menu-section border-bottom p-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div>
                                    <h6 className="mb-1">{menu.MenuName}</h6>
                                    <small className="text-muted">{menuActionsData.rules.description}</small>
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        className={`btn btn-sm me-2 ${allMenuSelected ? 'btn-success' : 'btn-outline-primary'}`}
                                        onClick={() => handleMenuSelectAll(menu.MenuID, true)}
                                        disabled={allMenuSelected}
                                    >
                                        Select All
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => handleMenuSelectAll(menu.MenuID, false)}
                                        disabled={menuSelectedCount === 0}
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>

                            <div className="row">
                                {menuActionsData.actions.map((action) => {
                                    const isChecked = selectedPolicies[`${menu.MenuID}-${action.ActionID}`] || false;
                                    // Map database action names to display labels
                                    const getDisplayLabel = (actionName, menuName) => {
                                        const actionLower = actionName?.toLowerCase();
                                        const menuLower = menuName?.toLowerCase();
                                        
                                        // For Home menu
                                        if (menuLower === 'home') {
                                            if (actionLower === 'retrieve') return 'Read';
                                            if (actionLower.includes('issue') && !actionLower.includes('unissue')) return 'Issue Device';
                                            if (actionLower.includes('unissue')) return 'Unissue Device';
                                        }
                                        
                                        // For Device Bulk Upload menu
                                        if (menuLower.includes('bulk') || menuLower.includes('upload')) {
                                            if (actionLower === 'retrieve') return 'Read';
                                            if (actionLower === 'create') return 'Import Device';
                                        }
                                        
                                        // For all other menus
                                        if (actionLower === 'retrieve') return 'Read';
                                        if (actionLower === 'create') return 'Create';
                                        if (actionLower === 'update') return 'Update';
                                        if (actionLower === 'delete') return 'Delete';
                                        
                                        // Fallback to original name
                                        return actionName;
                                    };

                                    return (
                                        <div key={action.ActionID} className="col-md-3 col-sm-6 mb-2">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`action-${menu.MenuID}-${action.ActionID}`}
                                                    checked={isChecked}
                                                    onChange={(e) => handleActionChange(menu.MenuID, action.ActionID, e.target.checked)}
                                                />
                                                <label 
                                                    className="form-check-label" 
                                                    htmlFor={`action-${menu.MenuID}-${action.ActionID}`}
                                                >
                                                    {getDisplayLabel(action.ActionName, menu.MenuName)}
                                                </label>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {menuSelectedCount > 0 && (
                                <div className="mt-2">
                                    <small className="text-success">
                                        ✓ {menuSelectedCount} action{menuSelectedCount !== 1 ? 's' : ''} selected
                                    </small>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {totalSelected > 0 && (
                <div className="alert alert-success mt-3">
                    <strong>Summary:</strong> {totalSelected} polic{totalSelected !== 1 ? 'ies' : 'y'} will be created across {menus.filter(menu => {
                        const menuActionsData = menuActions[menu.MenuID];
                        if (!menuActionsData) return false;
                        return menuActionsData.actions.some(action => selectedPolicies[`${menu.MenuID}-${action.ActionID}`]);
                    }).length} menu{menus.length !== 1 ? 's' : ''}.
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

export default MenuActionMatrix;
