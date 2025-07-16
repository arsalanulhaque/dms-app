import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import useSession from '../Context/SessionContext';
import FetchData from '../Hooks/FetchData';
import Header from '../Components/Header';
import DeviceList from '../Components/DeviceList';
import { 
    Box, 
    Paper, 
    Button, 
    Typography, 
    Alert, 
    AlertTitle,
    Container,
    CircularProgress,
    Breadcrumbs
} from '@mui/material';
import { Home as HomeIcon, Clear as ClearIcon, QrCodeScanner as ScanIcon } from '@mui/icons-material';

function Search() {
    const inputRef = useRef(null);
    const [getSession] = useSession();
    const [alertType, setAlertType] = useState('');
    const [message, setMessage] = useState('');
    const [isLoader, setLoader] = useState(false);
    const [lstIssuedDevices, setIssuedDevices] = useState([]);
    const [lstAvailableDevices, setAvailableDevices] = useState([]);
    const [lstUnavailableDevices, setUnavailableDevices] = useState([]);


    useEffect(() => {
        let intervalID = setInterval(() => {
            if (inputRef.current) {
                inputRef.current.focus()
            }
        }, 1000);

        return (() => {
            clearInterval(intervalID)
        })
    }, [])

    const onItemScan = (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            makeRequest(`device/barcode/${inputRef.current.value}/schoolID/${getSession()?.schoolID}`, 'get', undefined)
        }
    }

    const makeRequest = (api, method, body) => {
        FetchData(api, method, body, (response) => {
            if (response?.error) {
                setAlertType('danger')
                setMessage(response?.data?.message)
            }
            else if (response?.data?.length > 0 || response?.data?.data?.length > 0) {
                let device = response?.data[0]
                let session = getSession().data[0]
                if(device.FKUserID === null) device.FKUserID = session?.UserID
                if(device.DeviceStatusID=== null) device.DeviceStatusID = -1
                device.EmailID = session?.EmailID
                // device.Username = session?.Username
                device.SupervisorEmailID = session?.SupervisorEmailID
                //Available devices
                addToAvailableDevices(device)
                //Devices issued to logged in user
                addToIssuedDevices(device)
                //Devices reserved by someone else
                addToOccupiedDevices(device)
            }
        })
        inputRef.current.value = ''
    }

    const addToAvailableDevices = (device) => {
        if (device.Username === null) {
            if (!isDeviceInList(device, lstAvailableDevices) && lstIssuedDevices.length === 0) {
                // device.UserID = getSession()?.UserID
                // device.EmailID = getSession()?.EmailID
                 device.Username = getSession().data[0]?.Username
                // device.SupervisorEmailID = getSession().data[0]?.SupervisorEmailID
                let spreaded = [...lstAvailableDevices, device]
                spreaded.sort((a, b) => (a.IsIssued > b.IsIssued) ? 1 : ((b.IsIssued > a.IsIssued) ? -1 : 0))
                setSelectedOnScan(spreaded)
                setAvailableDevices(spreaded)
            }
            else {
                setAlertType('danger')
                setMessage('You can`t take a device while returning devices!')
            }
        }
    }

    const addToIssuedDevices = (device) => {
        if (device.IsIssued === 1 && device.FKUserID === getSession()?.data[0].UserID) {
            if (!isDeviceInList(device, lstIssuedDevices) && lstAvailableDevices.length === 0) {
                // device.UserID = getSession()?.UserID
                // device.EmailID = getSession()?.EmailID
                let spreaded = [...lstIssuedDevices, device]
                spreaded.sort((a, b) => (a.IsIssued > b.IsIssued) ? 1 : ((b.IsIssued > a.IsIssued) ? -1 : 0))
                setSelectedOnScan(spreaded)
                setIssuedDevices(spreaded)
            }
            else {
                setAlertType('danger')
                setMessage('You can`t return a device while booking new devices!')
            }
        }
    }

    const addToOccupiedDevices = (device) => {
        if (device.IsIssued === 1 && device.FKUserID !== getSession()?.userID) {
            if (!isDeviceInList(device, lstUnavailableDevices)) {
                device.FKUserID = getSession()?.userID;
                let spreaded = [...lstUnavailableDevices, device];
                spreaded = [...new Set(spreaded)];
                spreaded.sort((a, b) => (a.IsIssued > b.IsIssued) ? 1 : ((b.IsIssued > a.IsIssued) ? -1 : 0));
                setSelectedOnScan(spreaded);
                setUnavailableDevices(spreaded);
            }
        }
    }

    const isDeviceInList = (device, list) => {
        return list.findIndex(item => item.AssetID === device.AssetID) === -1 ? false : true
    }

    const setSelectedOnScan = (obj) => {
        obj.forEach(element => {
            if (element.IssuedDate === null || element.IssuedDate === 1) {
                element.selected = true
            } else {
                element.selected = false
            }
        });
    }

    const handleCheckout = () => {
        const body = { devices: lstAvailableDevices?.length > 0 ? lstAvailableDevices : lstUnavailableDevices }
        FetchData('device/checkout', 'put', body, (response) => {
            if (response?.error) {
                setAlertType('danger')
                setMessage(response?.data?.message)
            }
            else {
                setAlertType('success')
                setMessage(response?.data?.message)
                reset()
            }
        })
    }

    const handleCheckIn = () => {
        const body = { devices: lstIssuedDevices }
        FetchData('device/checkin', 'put', body, (response) => {
            if (response?.error) {
                setAlertType('danger')
                setMessage(response?.data?.message)
            }
            else {
                setAlertType('success')
                setMessage(response?.data?.message)
                reset()
            }
        })
    }

    const reset = () => {
        setIssuedDevices([...new Set([])])
        setAvailableDevices([...new Set([])])
        setUnavailableDevices([...new Set([])])
    }

    return (
        <>
            <Header />
            <Container maxWidth="xl" sx={{ mt: 10, mb: 4 }}>
                {/* Breadcrumb Navigation */}
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 2, 
                        mb: 3, 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'transparent'
                    }}
                >
                    <Breadcrumbs aria-label="breadcrumb">
                        {getSession()?.isAdmin === true && (
                            <Link 
                                to="/dashboard" 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    textDecoration: 'none',
                                    color: '#666'
                                }}
                            >
                                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                                Dashboard
                            </Link>
                        )}
                        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <ScanIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                            Search
                        </Typography>
                    </Breadcrumbs>
                    
                    {(lstIssuedDevices.length > 0 || lstAvailableDevices.length > 0 || lstUnavailableDevices.length > 0) && (
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<ClearIcon />}
                            onClick={reset}
                        >
                            Remove All
                        </Button>
                    )}
                </Paper>

                {/* Hidden Input for Barcode Scanner */}
                <input
                    type="text"
                    ref={inputRef}
                    onKeyDown={onItemScan}
                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                    autoComplete="off"
                />

                {/* Alert Messages */}
                {message && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <Alert 
                            severity={alertType === 'danger' ? 'error' : 'success'}
                            onClose={() => setMessage('')}
                            sx={{ 
                                width: '100%',
                                maxWidth: 600,
                                alignItems: 'center',
                                '& .MuiAlert-icon': {
                                    fontSize: '2rem'
                                }
                            }}
                        >
                            <AlertTitle>
                                {alertType === 'danger' ? 'Error' : 'Success'}
                            </AlertTitle>
                            {message}
                        </Alert>
                    </Box>
                )}

                {/* Loading State */}
                {isLoader ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                        <CircularProgress size={60} />
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {lstUnavailableDevices.length > 0 && (
                            <Box flex={1} minWidth={300}>
                                <DeviceList 
                                    state="unavailable" 
                                    title='Occupied Devices' 
                                    titleStyle='text-danger' 
                                    handleCheckout={handleCheckout} 
                                    products={lstUnavailableDevices} 
                                />
                            </Box>
                        )}
                        {lstAvailableDevices.length > 0 && (
                            <Box flex={1} minWidth={300}>
                                <DeviceList 
                                    state="available" 
                                    title='Available Devices' 
                                    titleStyle='text-success' 
                                    handleCheckout={handleCheckout} 
                                    products={lstAvailableDevices} 
                                />
                            </Box>
                        )}
                        {lstIssuedDevices.length > 0 && (
                            <Box flex={1} minWidth={300}>
                                <DeviceList 
                                    state="return" 
                                    title='Return Devices' 
                                    titleStyle='text-info' 
                                    handleCheckin={handleCheckIn} 
                                    products={lstIssuedDevices} 
                                />
                            </Box>
                        )}
                    </Box>
                )}

                {/* Empty State */}
                {!isLoader && lstUnavailableDevices.length === 0 && 
                 lstAvailableDevices.length === 0 && 
                 lstIssuedDevices.length === 0 && (
                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: 4, 
                            textAlign: 'center',
                            backgroundColor: '#fff',
                            boxShadow: '0 0 10px rgba(0,0,0,0.05)'
                        }}
                    >
                        <ScanIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h4" color="primary" gutterBottom>
                            Ready to Scan
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Start scanning your devices now!
                        </Typography>
                    </Paper>
                )}
            </Container>
        </>
    );
}

export default Search;