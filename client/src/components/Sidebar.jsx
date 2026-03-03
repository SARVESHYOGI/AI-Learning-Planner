import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { Link, useNavigate } from 'react-router-dom';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import QuizIcon from '@mui/icons-material/Quiz';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import ProfileIcon from '@mui/icons-material/Person2';

export default function Sidebar() {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('token');

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const logout = async () => {
        await localStorage.removeItem('token');
        navigate('/auth/login');

    };

    const listItems = [
        { text: 'Home', icon: <HomeIcon />, href: "/" },
        isLoggedIn && { text: 'Profile', icon: <ProfileIcon />, href: "/profile" },
        !isLoggedIn && { text: 'Login', icon: <LoginIcon />, href: "/auth/login" },
        !isLoggedIn && { text: 'Register', icon: <AppRegistrationIcon />, href: "/auth/register" },
        isLoggedIn && { text: 'Dashboard', icon: <DashboardIcon />, href: "/dashboard" },
        isLoggedIn && { text: 'Generate plan', icon: <QuizIcon />, href: "/questionnaire" },
        isLoggedIn && { text: 'Last plan', icon: <TipsAndUpdatesIcon />, href: "/generatedplans" },
        isLoggedIn && { text: 'My Tracked Plans', icon: <TipsAndUpdatesIcon />, href: "/trackingplan" },
        isLoggedIn && { text: 'Logout', icon: <LogoutIcon />, onClick: logout },
    ];

    const filteredListItems = listItems.filter(Boolean);

    const DrawerList = (
        <Box sx={{
            backdropFilter: 'blur(100px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '0.375rem',
            color: 'white',
            height: '100%',
            padding: '16px',
            background: 'transparent',
            overflowY: 'hidden',
        }} role="presentation" onClick={toggleDrawer(false)}>
            <List sx={{
                width: 250,
                flex: '1 1 auto',
                display: 'flex',
                flexDirection: 'column',
                padding: '0',
                justifyContent: 'center',
                height: '100%',
                overflowY: 'hidden',
            }}>
                {filteredListItems.map((item, index) => (
                    <Link to={item.href ? item.href : "#"} key={index}>
                        <ListItem key={index} disablePadding>
                            <ListItemButton onClick={item.onClick} sx={{
                                background: '#2e3c50',
                                borderRadius: '8px',
                                margin: '8px 0',
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.3)',
                                },
                                backdropFilter: 'blur(5px)',
                                transition: 'background 0.3s ease',
                            }}>
                                <ListItemIcon sx={{ color: 'white' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
            <Divider />
        </Box>
    );

    return (
        <div className="absolute top-0 left-0 bg-gray-800 text-white">
            <Button onClick={toggleDrawer(true)}>
                <MenuOpenIcon className="text-white" />
            </Button>
            <Drawer
                open={open}
                onClose={toggleDrawer(false)}
                sx={{
                    "& .MuiDrawer-paper": {
                        backgroundColor: "#121b29",
                        boxShadow: "none",
                    },
                }}
            >
                {DrawerList}
            </Drawer>
        </div>
    );
}
