// Dashboard Layout Component
// Main two-column grid layout for dashboard

import React from 'react';
import type { ReactNode } from 'react';
import './DashboardLayout.css';

interface DashboardLayoutProps {
    header: ReactNode;
    leftPanel: ReactNode;
    rightPanel: ReactNode;
    footer?: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    header,
    leftPanel,
    rightPanel,
    footer
}) => {
    return (
        <div className="dashboard-layout">
            <div className="dashboard-header">
                {header}
            </div>
            <div className="dashboard-grid">
                <div className="dashboard-left-panel">
                    {leftPanel}
                </div>
                <div className="dashboard-right-panel">
                    {rightPanel}
                </div>
            </div>
            {footer && (
                <div className="dashboard-footer">
                    {footer}
                </div>
            )}
        </div>
    );
};
