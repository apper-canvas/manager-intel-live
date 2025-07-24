import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { employeeService } from "@/services/api/employeeService";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
const AddEmployeeModal = ({ isOpen, onClose, onEmployeeAdded, employee = null, isEditMode = false }) => {
const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    startDate: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    "Engineering",
    "Product",
    "Design",
    "Marketing", 
    "Human Resources",
    "Finance",
    "Sales",
    "Operations"
  ];

// Populate form data when editing
  useEffect(() => {
    if (isEditMode && employee) {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        position: employee.position || "",
        department: employee.department || "",
        startDate: employee.startDate ? employee.startDate.split('T')[0] : ""
      });
    }
  }, [isEditMode, employee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Position is required";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      let result;
      if (isEditMode) {
        result = await employeeService.update(employee.Id, formData);
        toast.success("Employee updated successfully!");
      } else {
        result = await employeeService.create(formData);
        toast.success("Employee added successfully!");
      }
      onEmployeeAdded(result);
      handleClose();
    } catch (err) {
      toast.error(isEditMode ? "Failed to update employee. Please try again." : "Failed to add employee. Please try again.");
      console.error("Error saving employee:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      startDate: ""
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-6 pt-6 pb-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-primary-600">
                        <ApperIcon name="UserPlus" className="h-6 w-6 text-white" />
                      </div>
<h3 className="text-xl font-semibold text-gray-900">
                        {isEditMode ? "Edit Employee" : "Add New Employee"}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ApperIcon name="X" className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter employee's full name"
                      error={errors.name}
                      required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="employee@company.com"
                        error={errors.email}
                        required
                      />

                      <FormField
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                        error={errors.phone}
                        required
                      />
                    </div>

                    <FormField
                      label="Job Position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="e.g., Senior Software Engineer"
                      error={errors.position}
                      required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Department <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className={cn(
                            "flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors duration-200",
                            errors.department && "border-red-500"
                          )}
                        >
                          <option value="">Select Department</option>
                          {departments.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                        {errors.department && (
                          <p className="text-sm text-red-600">{errors.department}</p>
                        )}
                      </div>

                      <FormField
                        label="Start Date"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        error={errors.startDate}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="order-2 sm:order-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
disabled={isSubmitting}
                    className="order-1 sm:order-2 gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {isEditMode ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      <>
                        <ApperIcon name={isEditMode ? "Save" : "Plus"} className="h-4 w-4" />
                        {isEditMode ? "Update Employee" : "Add Employee"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddEmployeeModal;