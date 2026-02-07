// Dashboard Card Component
// Reusable card container for dashboard sections

import React from 'react';
import type { ReactNode } from 'react';
import './DashboardCard.css';

interface DashboardCardProps {
    title?: string;
    children: ReactNode;
    className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className = '' }) => {
    return (
        <div className={`dashboard-card ${className}`}>
            {title && (
                <div className="dashboard-card-header terminal-text">
                    {title}
                </div>
            )}
            <div className="dashboard-card-content">
                {children}
            </div>
        </div>
    );
};
