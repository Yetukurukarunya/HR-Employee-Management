import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import GlassCard from '../common/GlassCard';
import GlassIcon from '../common/GlassIcon';
import './Payslip.css';

const Payslip = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState('2026-07');
  const [activePayslip, setActivePayslip] = useState(null);

  const payslipRecord = {
    month: 'July 2026',
    employeeName: user?.name || 'Sarah Chen',
    employeeId: 'EMP-9823',
    department: user?.department || 'Engineering',
    position: user?.position || 'Senior FullStack Dev',
    bankAccount: '•••• •••• 8842',
    paymentDate: '2026-07-31',
    basicSalary: 6500,
    housingAllowance: 1200,
    transportAllowance: 450,
    bonus: 800,
    grossEarnings: 8950,
    taxDeduction: 1120,
    healthInsurance: 350,
    pensionFund: 480,
    totalDeductions: 1950,
    netPayable: 7000
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="payslip-page-container">
      {/* Header Banner */}
      <div className="page-header-banner glass-panel">
        <div>
          <span className="glass-badge glass-badge-primary">
            <GlassIcon name="Banknote" size={14} glow={false} /> Payroll Statements
          </span>
          <h1>Official Payslips</h1>
          <p>View earnings, allowances, deductions, and download monthly statements</p>
        </div>

        <div className="hero-actions">
          <button className="glass-button" onClick={handlePrint}>
            <GlassIcon name="Printer" size={18} glow={false} />
            <span>Print Payslip</span>
          </button>
        </div>
      </div>

      {/* Payslip Receipt Card */}
      <div className="payslip-receipt-card glass-panel">
        <div className="receipt-header-row">
          <div className="company-brand-meta">
            <GlassIcon name="Building2" variant="primary" size={32} />
            <div>
              <h2>Apex Enterprise Technologies</h2>
              <p>Salary Disbursement Slip • {payslipRecord.month}</p>
            </div>
          </div>
          <div className="receipt-net-badge">
            <span>NET PAYABLE</span>
            <div className="net-amount">${payslipRecord.netPayable.toLocaleString()}</div>
          </div>
        </div>

        <div className="menu-divider" />

        {/* Employee Summary Grid */}
        <div className="receipt-info-grid">
          <div className="meta-box">
            <span className="meta-lbl">Employee Name</span>
            <strong className="meta-val">{payslipRecord.employeeName}</strong>
          </div>
          <div className="meta-box">
            <span className="meta-lbl">Employee ID</span>
            <strong className="meta-val">{payslipRecord.employeeId}</strong>
          </div>
          <div className="meta-box">
            <span className="meta-lbl">Department</span>
            <strong className="meta-val">{payslipRecord.department}</strong>
          </div>
          <div className="meta-box">
            <span className="meta-lbl">Payment Date</span>
            <strong className="meta-val">{payslipRecord.paymentDate}</strong>
          </div>
        </div>

        {/* Financial Breakdown Tables */}
        <div className="financial-breakdown-row">
          {/* Earnings */}
          <div className="breakdown-table-box glass-panel">
            <div className="box-title positive"><GlassIcon name="ArrowUpRight" size={16} glow={false} /> Earnings</div>
            <div className="line-item"><span>Basic Salary</span><strong>${payslipRecord.basicSalary.toLocaleString()}</strong></div>
            <div className="line-item"><span>Housing Allowance</span><strong>${payslipRecord.housingAllowance.toLocaleString()}</strong></div>
            <div className="line-item"><span>Transport Allowance</span><strong>${payslipRecord.transportAllowance.toLocaleString()}</strong></div>
            <div className="line-item"><span>Performance Bonus</span><strong>${payslipRecord.bonus.toLocaleString()}</strong></div>
            <div className="total-line positive"><span>Total Gross Earnings</span><strong>${payslipRecord.grossEarnings.toLocaleString()}</strong></div>
          </div>

          {/* Deductions */}
          <div className="breakdown-table-box glass-panel">
            <div className="box-title negative"><GlassIcon name="ArrowDownRight" size={16} glow={false} /> Deductions</div>
            <div className="line-item"><span>Income Tax (PAYE)</span><strong>${payslipRecord.taxDeduction.toLocaleString()}</strong></div>
            <div className="line-item"><span>Health Insurance</span><strong>${payslipRecord.healthInsurance.toLocaleString()}</strong></div>
            <div className="line-item"><span>Pension Contribution</span><strong>${payslipRecord.pensionFund.toLocaleString()}</strong></div>
            <div className="total-line negative"><span>Total Deductions</span><strong>${payslipRecord.totalDeductions.toLocaleString()}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payslip;
