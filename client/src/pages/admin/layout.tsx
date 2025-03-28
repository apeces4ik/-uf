import React, { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/admin-sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="md:w-64 md:shrink-0 bg-white md:min-h-screen md:border-r">
        <AdminSidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;