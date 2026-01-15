import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-omg-bg text-gray-200 font-sans selection:bg-omg-accent selection:text-omg-bg">
            {children}
        </div>
    );
};

export default Layout;
