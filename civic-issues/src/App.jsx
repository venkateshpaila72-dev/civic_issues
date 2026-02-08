import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DepartmentProvider } from './context/DepartmentContext';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <DepartmentProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </DepartmentProvider>
    </AuthProvider>
  );
}

export default App;