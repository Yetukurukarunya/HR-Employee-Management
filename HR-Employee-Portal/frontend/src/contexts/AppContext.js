import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Initial Seed Data for synchronized multi-role experience
const INITIAL_EMPLOYEES = [
  { id: 1, name: 'Alex Morgan', email: 'alex.m@company.com', role: 'hr', department: 'Human Resources', position: 'HR Director', phone: '+1 (555) 234-5678', status: 'Active', joinDate: '2022-01-15', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', salary: 95000 },
  { id: 2, name: 'Marcus Vance', email: 'marcus.v@company.com', role: 'manager', department: 'Engineering', position: 'Engineering Lead', phone: '+1 (555) 345-6789', status: 'Active', joinDate: '2021-06-10', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', salary: 110000 },
  { id: 3, name: 'Sarah Chen', email: 'sarah.c@company.com', role: 'employee', department: 'Engineering', position: 'Senior FullStack Dev', phone: '+1 (555) 456-7890', status: 'Active', joinDate: '2023-03-01', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', salary: 88000 },
  { id: 4, name: 'David Miller', email: 'david.m@company.com', role: 'employee', department: 'Design', position: 'UI/UX Specialist', phone: '+1 (555) 567-8901', status: 'On Leave', joinDate: '2022-11-20', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', salary: 78000 },
  { id: 5, name: 'Elena Rostova', email: 'elena.r@company.com', role: 'employee', department: 'Marketing', position: 'Growth Strategist', phone: '+1 (555) 678-9012', status: 'Active', joinDate: '2023-08-14', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', salary: 72000 },
];

const INITIAL_LEAVES = [
  { id: 101, employeeId: 3, employeeName: 'Sarah Chen', department: 'Engineering', type: 'Annual Leave', startDate: '2026-07-22', endDate: '2026-07-25', days: 4, reason: 'Family vacation', status: 'Pending', requestedOn: '2026-07-18' },
  { id: 102, employeeId: 4, employeeName: 'David Miller', department: 'Design', type: 'Sick Leave', startDate: '2026-07-18', endDate: '2026-07-20', days: 3, reason: 'Doctor prescribed rest', status: 'Approved', requestedOn: '2026-07-17' },
  { id: 103, employeeId: 5, employeeName: 'Elena Rostova', department: 'Marketing', type: 'Personal', startDate: '2026-08-01', endDate: '2026-08-02', days: 2, reason: 'Personal errands', status: 'Pending', requestedOn: '2026-07-19' },
];

const INITIAL_ATTENDANCE = [
  { id: 201, employeeId: 3, date: '2026-07-19', clockIn: '08:58 AM', clockOut: null, hoursWorked: '7h 12m', status: 'Present' },
  { id: 202, employeeId: 2, date: '2026-07-19', clockIn: '08:45 AM', clockOut: '05:15 PM', hoursWorked: '8h 30m', status: 'Present' },
  { id: 203, employeeId: 1, date: '2026-07-19', clockIn: '09:02 AM', clockOut: null, hoursWorked: '7h 05m', status: 'Present' },
  { id: 204, employeeId: 4, date: '2026-07-19', clockIn: '-', clockOut: '-', hoursWorked: '0h', status: 'On Leave' },
];

const INITIAL_NOTIFICATIONS = [
  { id: 301, title: 'New Leave Request', message: 'Sarah Chen requested 4 days Annual Leave', time: '10 mins ago', type: 'leave', unread: true },
  { id: 302, title: 'Payroll Processed', message: 'July 2026 Payroll batch ready for review', time: '2 hours ago', type: 'payroll', unread: true },
  { id: 303, title: 'Attendance Alert', message: 'Marcus Vance clocked in at 08:45 AM', time: '4 hours ago', type: 'attendance', unread: false },
];

export const AppProvider = ({ children }) => {
  // Synchronized state with localStorage persistence
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('app_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [leaves, setLeaves] = useState(() => {
    const saved = localStorage.getItem('app_leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('app_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('app_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [userClockState, setUserClockState] = useState({
    clockedIn: true,
    clockInTime: '08:58 AM',
    elapsedSeconds: 25920 // ~7.2 hrs
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('app_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('app_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('app_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('app_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Actions for Cross-Role Coordination
  const addLeaveRequest = (newLeave) => {
    const leaveItem = {
      id: Date.now(),
      status: 'Pending',
      requestedOn: new Date().toISOString().split('T')[0],
      ...newLeave
    };
    setLeaves(prev => [leaveItem, ...prev]);

    // Add Notification
    addNotification({
      title: 'New Leave Request Submitted',
      message: `${leaveItem.employeeName} requested ${leaveItem.days} day(s) of ${leaveItem.type}`,
      type: 'leave'
    });
  };

  const updateLeaveStatus = (leaveId, newStatus) => {
    setLeaves(prev => prev.map(l => {
      if (l.id === leaveId) {
        return { ...l, status: newStatus };
      }
      return l;
    }));

    const targetLeave = leaves.find(l => l.id === leaveId);
    if (targetLeave) {
      addNotification({
        title: `Leave Request ${newStatus}`,
        message: `Leave request for ${targetLeave.employeeName} has been ${newStatus.toLowerCase()}`,
        type: 'leave'
      });
    }
  };

  const toggleClock = (user) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    if (!userClockState.clockedIn) {
      // Clock In
      setUserClockState({
        clockedIn: true,
        clockInTime: timeStr,
        elapsedSeconds: 0
      });

      // Update or add log
      setAttendance(prev => [
        {
          id: Date.now(),
          employeeId: user?.id || 3,
          date: dateStr,
          clockIn: timeStr,
          clockOut: null,
          hoursWorked: '0h 01m',
          status: 'Present'
        },
        ...prev.filter(a => !(a.employeeId === (user?.id || 3) && a.date === dateStr))
      ]);

      addNotification({
        title: 'Clock In Successful',
        message: `You clocked in at ${timeStr}`,
        type: 'attendance'
      });
    } else {
      // Clock Out
      setUserClockState(prev => ({
        ...prev,
        clockedIn: false
      }));

      setAttendance(prev => prev.map(a => {
        if (a.employeeId === (user?.id || 3) && a.date === dateStr) {
          return { ...a, clockOut: timeStr, hoursWorked: '8h 00m' };
        }
        return a;
      }));

      addNotification({
        title: 'Clock Out Successful',
        message: `You clocked out at ${timeStr}`,
        type: 'attendance'
      });
    }
  };

  const addNotification = ({ title, message, type = 'info' }) => {
    const notif = {
      id: Date.now(),
      title,
      message,
      time: 'Just now',
      type,
      unread: true
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const addEmployee = (employeeData) => {
    const newEmp = {
      id: Date.now(),
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      ...employeeData
    };
    setEmployees(prev => [newEmp, ...prev]);

    addNotification({
      title: 'New Employee Onboarded',
      message: `${newEmp.name} added to ${newEmp.department} as ${newEmp.position}`,
      type: 'info'
    });
  };

  const updateEmployee = (id, updatedData) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updatedData } : e));
  };

  const deleteEmployee = (id) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  return (
    <AppContext.Provider value={{
      employees,
      leaves,
      attendance,
      notifications,
      userClockState,
      addLeaveRequest,
      updateLeaveStatus,
      toggleClock,
      addNotification,
      markAllNotificationsRead,
      addEmployee,
      updateEmployee,
      deleteEmployee
    }}>
      {children}
    </AppContext.Provider>
  );
};
