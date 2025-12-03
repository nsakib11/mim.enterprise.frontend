import { Employee, EmploymentStatus, EmployeeType } from "@/utils/types";

interface StatisticsCardsProps {
  employees: Employee[];
}

export default function StatisticsCards({ employees }: StatisticsCardsProps) {
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.employmentStatus === EmploymentStatus.ACTIVE).length;
  const uniqueEmployeeTypes = new Set(employees.map(emp => emp.employeeType)).size;
  const totalMonthlySalary = employees.reduce((sum, emp) => sum + (emp.currentSalary || 0), 0);
  const averageSalary = totalEmployees > 0 ? totalMonthlySalary / totalEmployees : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusColor = (status: EmploymentStatus) => {
    const colors = {
      [EmploymentStatus.ACTIVE]: "bg-green-100",
      [EmploymentStatus.INACTIVE]: "bg-red-100",
      [EmploymentStatus.TERMINATED]: "bg-gray-100",
      [EmploymentStatus.ON_LEAVE]: "bg-yellow-100"
    };
    return colors[status] || "bg-gray-100";
  };

  const getTypeColor = (type: EmployeeType) => {
    const colors = {
      [EmployeeType.SALES_PERSON]: "bg-blue-100",
      [EmployeeType.DRIVER]: "bg-purple-100",
      [EmployeeType.LABOR]: "bg-orange-100",
      [EmployeeType.OFFICER]: "bg-cyan-100",
      [EmployeeType.MANAGER]: "bg-indigo-100"
    };
    return colors[type] || "bg-gray-100";
  };

  return (
    <div className="mt-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Employees</h3>
          <p className="text-3xl font-bold text-blue-600">{totalEmployees}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Employees</h3>
          <p className="text-3xl font-bold text-green-600">{activeEmployees}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Employee Types</h3>
          <p className="text-3xl font-bold text-purple-600">{uniqueEmployeeTypes}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Monthly Salary</h3>
          <p className="text-2xl font-bold text-indigo-600">{formatCurrency(totalMonthlySalary)}</p>
        </div>
      </div>

      {/* Distribution Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Employee Types Distribution</h3>
          <div className="space-y-3">
            {Object.values(EmployeeType).map(type => {
              const count = employees.filter(emp => emp.employeeType === type).length;
              const percentage = totalEmployees > 0 ? (count / totalEmployees) * 100 : 0;
              
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${getTypeColor(type)}`}></div>
                    <span className="text-sm text-gray-700">{type.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500 ml-2">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Employment Status</h3>
          <div className="space-y-3">
            {Object.values(EmploymentStatus).map(status => {
              const count = employees.filter(emp => emp.employmentStatus === status).length;
              const percentage = totalEmployees > 0 ? (count / totalEmployees) * 100 : 0;
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${getStatusColor(status)}`}></div>
                    <span className="text-sm text-gray-700">{status.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500 ml-2">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Salary Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Total Monthly Salary</div>
            <div className="text-xl font-bold text-blue-700">{formatCurrency(totalMonthlySalary)}</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Average Salary</div>
            <div className="text-xl font-bold text-green-700">{formatCurrency(averageSalary)}</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Active Employee Salary</div>
            <div className="text-xl font-bold text-purple-700">
              {formatCurrency(
                employees
                  .filter(emp => emp.employmentStatus === EmploymentStatus.ACTIVE)
                  .reduce((sum, emp) => sum + (emp.currentSalary || 0), 0)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}