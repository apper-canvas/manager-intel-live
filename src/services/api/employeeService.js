export const employeeService = {
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
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "position_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "status_c" } }
        ],
        orderBy: [
          {
            fieldName: "Id",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('employee_c', params);

      if (!response || !response.success) {
        console.error("Error fetching employees:", response?.message || "Unknown error");
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching employees:", error?.response?.data?.message);
      } else {
        console.error("Error fetching employees:", error.message);
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
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "position_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "status_c" } }
        ]
      };

      const response = await apperClient.getRecordById('employee_c', parseInt(id), params);

      if (!response || !response.success) {
        throw new Error(response?.message || "Employee not found");
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching employee with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching employee with ID ${id}:`, error.message);
      }
      throw error;
    }
  },

  async create(employeeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: employeeData.Name || employeeData.name,
          email_c: employeeData.email_c || employeeData.email,
          phone_c: employeeData.phone_c || employeeData.phone,
          position_c: employeeData.position_c || employeeData.position,
          department_c: employeeData.department_c || employeeData.department,
          start_date_c: employeeData.start_date_c || employeeData.startDate,
          status_c: employeeData.status_c || employeeData.status || "Active"
        }]
      };

      const response = await apperClient.createRecord('employee_c', params);

      if (!response.success) {
        console.error("Error creating employee:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} employee records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating employee:", error?.response?.data?.message);
      } else {
        console.error("Error creating employee:", error.message);
      }
      throw error;
    }
  },

  async update(id, employeeData) {
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

      if (employeeData.Name || employeeData.name) updateData.Name = employeeData.Name || employeeData.name;
      if (employeeData.email_c || employeeData.email) updateData.email_c = employeeData.email_c || employeeData.email;
      if (employeeData.phone_c || employeeData.phone) updateData.phone_c = employeeData.phone_c || employeeData.phone;
      if (employeeData.position_c || employeeData.position) updateData.position_c = employeeData.position_c || employeeData.position;
      if (employeeData.department_c || employeeData.department) updateData.department_c = employeeData.department_c || employeeData.department;
      if (employeeData.start_date_c || employeeData.startDate) updateData.start_date_c = employeeData.start_date_c || employeeData.startDate;
      if (employeeData.status_c || employeeData.status) updateData.status_c = employeeData.status_c || employeeData.status;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('employee_c', params);

      if (!response.success) {
        console.error("Error updating employee:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} employee records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating employee:", error?.response?.data?.message);
      } else {
        console.error("Error updating employee:", error.message);
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

      const response = await apperClient.deleteRecord('employee_c', params);

      if (!response.success) {
        console.error("Error deleting employee:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} employee records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting employee:", error?.response?.data?.message);
      } else {
        console.error("Error deleting employee:", error.message);
      }
      throw error;
    }
  },

  async getByDepartment(department) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "position_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "status_c" } }
        ],
        where: [
          {
            FieldName: "department_c",
            Operator: "EqualTo",
            Values: [department]
          }
        ]
      };

      const response = await apperClient.fetchRecords('employee_c', params);

      if (!response || !response.success) {
        console.error("Error fetching employees by department:", response?.message || "Unknown error");
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching employees by department:", error?.response?.data?.message);
      } else {
        console.error("Error fetching employees by department:", error.message);
      }
      return [];
    }
  },

  async search(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "position_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "status_c" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "Name",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "email_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "position_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "department_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              }
            ]
          }
        ]
      };

      const response = await apperClient.fetchRecords('employee_c', params);

      if (!response || !response.success) {
        console.error("Error searching employees:", response?.message || "Unknown error");
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching employees:", error?.response?.data?.message);
      } else {
        console.error("Error searching employees:", error.message);
      }
      return [];
    }
}
};