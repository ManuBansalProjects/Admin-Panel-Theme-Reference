import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function PsychicDashboardLayout() {
    
    return (
        <div className='dashboard-wrapper py-5'>
            <div className='container'>
                <div className='dashboard-container d-flex'>
                    <Sidebar />
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
