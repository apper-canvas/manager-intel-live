import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { cn } from "@/utils/cn";
import { employeeService } from "@/services/api/employeeService";
import ApperIcon from "@/components/ApperIcon";
import AddEmployeeModal from "@/components/organisms/AddEmployeeModal";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const EmployeeTable = ({ onAddEmployee }) => {
const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [editingCell, setEditingCell] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      setError("Failed to load employees. Please try again.");
      console.error("Error loading employees:", err);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
    loadEmployees();
  }, []);

  const handleCellEdit = (employeeId, field, currentValue) => {
    setEditingCell({ employeeId, field });
    setEditingValue(currentValue);
  };

  const handleCellSave = async (employeeId, field) => {
    if (editingValue.trim() === "") {
      toast.error("Value cannot be empty");
      return;
    }

    try {
      const updatedEmployee = await employeeService.update(employeeId, {
        [field]: editingValue
      });
      setEmployees(employees.map(emp => 
        emp.Id === employeeId ? updatedEmployee : emp
      ));
      setEditingCell(null);
      setEditingValue("");
      toast.success("Employee updated successfully");
    } catch (err) {
      toast.error("Failed to update employee");
      console.error("Error updating employee:", err);
    }
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditingValue("");
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleEmployeeUpdated = (updatedEmployee) => {
    setEmployees(employees.map(emp => 
      emp.Id === updatedEmployee.Id ? updatedEmployee : emp
    ));
    setIsEditModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      await employeeService.delete(employeeId);
      setEmployees(employees.filter(emp => emp.Id !== employeeId));
      toast.success("Employee deleted successfully");
    } catch (err) {
      toast.error("Failed to delete employee");
      console.error("Error deleting employee:", err);
    }
  };

// Filter and sort employees
  const filteredAndSortedEmployees = React.useMemo(() => {
    let filtered = employees.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [employees, searchTerm, sortConfig]);

  const renderEditableCell = (employee, field, value) => {
    const isEditing = editingCell && editingCell.employeeId === employee.Id && editingCell.field === field;
    
    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCellSave(employee.Id, field);
              } else if (e.key === 'Escape') {
                handleCellCancel();
              }
            }}
            autoFocus
          />
          <button
            onClick={() => handleCellSave(employee.Id, field)}
            className="p-1 text-green-600 hover:text-green-800"
          >
            <ApperIcon name="Check" className="h-3 w-3" />
          </button>
          <button
            onClick={handleCellCancel}
            className="p-1 text-red-600 hover:text-red-800"
          >
            <ApperIcon name="X" className="h-3 w-3" />
          </button>
        </div>
      );
    }

    return (
      <div 
        className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded group"
        onClick={() => handleCellEdit(employee.Id, field, value)}
      >
        <span className="text-sm text-gray-900">{value}</span>
        <ApperIcon name="Edit" className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 ml-2 inline" />
      </div>
    );
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadEmployees} />;
  }

  if (employees.length === 0) {
    return (
      <Empty
        title="No employees found"
        description="Start building your team by adding your first employee."
        icon="Users"
        actionLabel="Add Employee"
        onAction={onAddEmployee}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee Directory</h2>
          <p className="text-gray-600 mt-1">
            Manage your team members and their information
          </p>
        </div>
        <Button onClick={onAddEmployee} className="gap-2 shrink-0">
          <ApperIcon name="Plus" className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search employees..."
          className="flex-1"
        />
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <ApperIcon name="Users" className="h-4 w-4" />
          {filteredAndSortedEmployees.length} employee{filteredAndSortedEmployees.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { key: "name", label: "Name" },
                  { key: "position", label: "Position" },
                  { key: "department", label: "Department" },
                  { key: "email", label: "Email" },
                  { key: "startDate", label: "Start Date" }
                ].map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {sortConfig.key === column.key && (
                        <ApperIcon
                          name={sortConfig.direction === "asc" ? "ChevronUp" : "ChevronDown"}
                          className="h-4 w-4"
                        />
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedEmployees.map((employee, index) => (
                <tr
                  key={employee.Id}
                  className={cn(
                    "hover:bg-gray-50 transition-colors",
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  )}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-primary-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {employee.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.phone}
                        </div>
                      </div>
                    </div>
</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderEditableCell(employee, 'name', employee.name)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderEditableCell(employee, 'position', employee.position)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                      {employee.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderEditableCell(employee, 'email', employee.email)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(employee.startDate), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
<Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-primary-600"
                        onClick={() => handleEditEmployee(employee)}
                      >
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-red-600"
                        onClick={() => handleDeleteEmployee(employee.Id)}
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
</tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Employee Modal */}
      {isEditModalOpen && selectedEmployee && (
        <AddEmployeeModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEmployee(null);
          }}
          onEmployeeAdded={handleEmployeeUpdated}
          employee={selectedEmployee}
          isEditMode={true}
        />
      )}
    </div>
  );
};

export default EmployeeTable;