import { employeeService } from "./employeeService.js";

export const departmentService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description_c" } },
          { field: { Name: "employee_count_c" } }
        ],
        orderBy: [
          {
            fieldName: "Id",
            sorttype: "ASC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('department_c', params);

      if (!response || !response.success) {
        console.error("Error fetching departments:", response?.message || "Unknown error");
        return [];
      }

      // Update employee counts dynamically
      const employees = await employeeService.getAll();
      const updatedDepartments = (response.data || []).map(dept => {
        const employeeCount = employees.filter(emp => emp.department_c === dept.Name).length;
        return { ...dept, employee_count_c: employeeCount };
      });

      return updatedDepartments;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching departments:", error?.response?.data?.message);
      } else {
        console.error("Error fetching departments:", error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description_c" } },
          { field: { Name: "employee_count_c" } }
        ]
      };

      const response = await apperClient.getRecordById('department_c', parseInt(id), params);

      if (!response || !response.success) {
        throw new Error(response?.message || "Department not found");
      }

      // Get employees for this department
      const employees = await employeeService.getByDepartment(response.data.Name);
      
      return { 
        ...response.data, 
        employee_count_c: employees.length,
        employees 
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching department with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching department with ID ${id}:`, error.message);
      }
      throw error;
    }
  },

  async create(departmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: departmentData.Name || departmentData.name,
          description_c: departmentData.description_c || departmentData.description,
          employee_count_c: departmentData.employee_count_c || departmentData.employeeCount || 0
        }]
      };

      const response = await apperClient.createRecord('department_c', params);

      if (!response.success) {
        console.error("Error creating department:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} department records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating department:", error?.response?.data?.message);
      } else {
        console.error("Error creating department:", error.message);
      }
      throw error;
    }
  },

  async update(id, departmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateData = {
        Id: parseInt(id)
      };

      if (departmentData.Name || departmentData.name) updateData.Name = departmentData.Name || departmentData.name;
      if (departmentData.description_c || departmentData.description) updateData.description_c = departmentData.description_c || departmentData.description;
      if (departmentData.employee_count_c || departmentData.employeeCount) updateData.employee_count_c = departmentData.employee_count_c || departmentData.employeeCount;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('department_c', params);

      if (!response.success) {
        console.error("Error updating department:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} department records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating department:", error?.response?.data?.message);
      } else {
        console.error("Error updating department:", error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('department_c', params);

      if (!response.success) {
        console.error("Error deleting department:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} department records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting department:", error?.response?.data?.message);
      } else {
        console.error("Error deleting department:", error.message);
      }
      throw error;
    }
  }
};