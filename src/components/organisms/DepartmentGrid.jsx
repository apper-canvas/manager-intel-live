import React, { useState, useEffect } from "react";
import { departmentService } from "@/services/api/departmentService";
import { employeeService } from "@/services/api/employeeService";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { cn } from "@/utils/cn";

const DepartmentGrid = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (err) {
      setError("Failed to load departments. Please try again.");
      console.error("Error loading departments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const getDepartmentIcon = (departmentName) => {
    const iconMap = {
      "Engineering": "Code",
      "Product": "Lightbulb",
      "Design": "Palette", 
      "Marketing": "Megaphone",
      "Human Resources": "Users",
      "Finance": "DollarSign",
      "Sales": "TrendingUp",
      "Operations": "Settings"
    };
    return iconMap[departmentName] || "Building2";
  };

  const getDepartmentGradient = (index) => {
    const gradients = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600", 
      "from-green-500 to-green-600",
      "from-orange-500 to-orange-600",
      "from-pink-500 to-pink-600",
      "from-cyan-500 to-cyan-600",
      "from-indigo-500 to-indigo-600",
      "from-red-500 to-red-600"
    ];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDepartments} />;
  }

  if (departments.length === 0) {
    return (
      <Empty
        title="No departments found"
        description="Start organizing your company by creating departments."
        icon="Building2"
        actionLabel="Add Department"
        onAction={() => {}}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Departments</h2>
        <p className="text-gray-600 mt-1">
          Overview of all company departments and their teams
        </p>
      </div>

      {/* Department Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{departments.map((department, index) => (
          <Card 
            key={department.Id} 
            className="p-6 hover:scale-[1.02] cursor-pointer transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-3 rounded-xl bg-gradient-to-r",
                  getDepartmentGradient(index)
                )}>
                  <ApperIcon 
                    name={getDepartmentIcon(department.Name)} 
                    className="h-6 w-6 text-white" 
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {department.Name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {department.description_c}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ApperIcon name="Users" className="h-4 w-4 text-gray-400" />
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                  {department.employee_count_c}
                </span>
                <span className="text-sm text-gray-500">
                  employee{department.employee_count_c !== 1 ? "s" : ""}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-primary-600 hover:text-primary-700 transition-colors">
                <span className="mr-1">View details</span>
                <ApperIcon name="ArrowRight" className="h-4 w-4" />
              </div>
            </div>

            {/* Employee Preview */}
            {department.employee_count_c > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[...Array(Math.min(department.employee_count_c, 3))].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 border-2 border-white flex items-center justify-center"
                      >
                        <span className="text-xs font-medium text-white">
                          {String.fromCharCode(65 + i)}
                        </span>
                      </div>
                    ))}
                    {department.employee_count_c > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          +{department.employee_count_c - 3}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">Team members</span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DepartmentGrid;