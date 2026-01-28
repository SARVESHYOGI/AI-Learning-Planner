import React from 'react';
import { Outlet } from 'react-router-dom';  // This will render the child routes
import Sidebar from '../components/Sidebar';

const Layout = () => {
    return (
        <div className="relative w-full h-screen flex">
            {/* Background Image */}
            {/* <div className="absolute top-0 left-0 w-full h-full bg-cover -z-10 " style={{ backgroundImage: 'url(https://static.vecteezy.com/system/resources/thumbnails/008/300/420/small_2x/multiple-database-is-placed-on-relational-database-tables-with-server-room-and-datacenter-background-concept-of-database-server-sql-data-storage-database-diagram-design-3d-illustration-photo.jpg)' }}></div> */}
            <div className="absolute top-0 left-0 w-full h-full bg-[#0a0f1a] -z-10"></div>

            {/* <StyledBackground /> */}
            {/* Sidebar */}
            <div className="w-64 z-20 absolute">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1  overflow-y-scroll z-10">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
