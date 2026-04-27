import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import useSession from '../Context/SessionContext';
import FetchData from '../Hooks/FetchData';
import { Box, Typography, Paper, Grid, Container } from '@mui/material';
import { School as SchoolIcon, Devices as DevicesIcon, People as PeopleIcon, History as HistoryIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function Dashboard() {
    const [getSession] = useSession();
    const sessionUser = getSession()?.data?.[0] || {};
    const userName = sessionUser.Username || 'User';
    const sessionSchoolName = sessionUser.SchoolName;
    const schoolID = getSession()?.schoolID;
    const isAppDeveloper = getSession()?.isAppDeveloper === true;
    const [schoolName, setSchoolName] = useState(sessionSchoolName || '');

    useEffect(() => {
        // Fetch the school name when not embedded in the session payload (white-labeling).
        // App Developers (Super Admins) are not tied to a single school, so skip the lookup.
        if (sessionSchoolName || isAppDeveloper || !schoolID) return;

        FetchData(`school/${schoolID}`, 'get', null, (response) => {
            if (response?.error === false && Array.isArray(response?.data) && response.data.length > 0) {
                setSchoolName(response.data[0]?.SchoolName || '');
            }
        });
    }, [sessionSchoolName, isAppDeveloper, schoolID]);


    const quickLinks = [
        {
            title: 'Schools',
            description: 'Manage schools and their settings',
            icon: <SchoolIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
            forAdmin: false,
            link: '/manageschools'
        },
        {
            title: 'Devices',
            description: 'View and manage all devices',
            icon: <DevicesIcon sx={{ fontSize: 40, color: '#2e7d32' }} />,
            forAdmin: true,
            link: '/managedevices'
        },
        {
            title: 'Users',
            description: 'Manage users and permissions',
            icon: <PeopleIcon sx={{ fontSize: 40, color: '#ed6c02' }} />,
            forAdmin: true,
            link: '/manageusers'
        },
        {
            title: 'Device History',
            description: 'View device history',
            icon: <HistoryIcon sx={{ fontSize: 40, color: '#9c27b0' }} />,
            forAdmin: true,
            link: '/managedevicestatus'
        }
    ];
    console.log(getSession());

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Welcome, {userName}! 👋
                        </Typography>
                        {schoolName && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <SchoolIcon sx={{ fontSize: 24, color: '#1976d2', mr: 1 }} />
                                <Typography variant="h6" component="h2" sx={{ color: '#1976d2', fontWeight: 500 }}>
                                    {schoolName}
                                </Typography>
                            </Box>
                        )}
                        <Typography variant="body1" color="text.secondary" paragraph>
                            This is your Asset Management System dashboard. Use the sidebar menu to navigate through different sections of the application.
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {quickLinks
                            .filter(link => link.forAdmin === true || getSession()?.isAppDeveloper)
                            .map((link, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index} >
                                    <Link to={link.link}>
                                    <Paper
                                        sx={{
                                            p: 3,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            height: '100%',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 3,
                                                cursor: 'pointer'
                                            }
                                        }}
                                    >
                                        {link.icon}
                                        <Typography variant="h6" component="h2" sx={{ mt: 2, mb: 1 }}>
                                            {link.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                                {link.description}
                                            </Typography>
                                        </Paper>
                                    </Link>
                                </Grid>
                            ))}
                    </Grid>

                    <Box sx={{ mt: 4 }}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h5" component="h2" gutterBottom>
                                Getting Started
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Here are some things you can do:
                            </Typography>
                            <ul style={{ paddingLeft: '20px' }}>
                                <li>
                                    <Typography variant="body1" paragraph>
                                        Use the sidebar menu to navigate through different sections
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body1" paragraph>
                                        Check device status and manage device assignments
                                    </Typography>
                                </li>
                                {getSession()?.isAppDeveloper && (
                                    <>
                                        <li>
                                            <Typography variant="body1" paragraph>
                                                Manage schools and their configurations
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography variant="body1" paragraph>
                                                Set up user roles and permissions
                                            </Typography>
                                        </li>
                                    </>
                                )}
                                {getSession()?.isAdmin && (
                                    <>
                                        <li>
                                            <Typography variant="body1" paragraph>
                                                Set Weekly Report
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography variant="body1" paragraph>
                                                Set Reminder Settings
                                            </Typography>
                                        </li>
                                    </>
                                )}

                                <li>
                                    <Typography variant="body1" paragraph>
                                        View and generate reports for device usage
                                    </Typography>
                                </li>
                            </ul>
                        </Paper>
                    </Box>
                </Container>
            </main>
        </>
    );
}

export default Dashboard;