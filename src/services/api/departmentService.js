import departmentsData from "@/services/mockData/departments.json";
import { employeeService } from "./employeeService.js";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let departments = [...departmentsData];

export const departmentService = {
  async getAll() {
    await delay(300);
    // Update employee counts dynamically
    const employees = await employeeService.getAll();
    const updatedDepartments = departments.map(dept => {
      const employeeCount = employees.filter(emp => emp.department === dept.name).length;
      return { ...dept, employeeCount };
    });
    return updatedDepartments;
  },

  async getById(id) {
    await delay(200);
    const department = departments.find(dept => dept.Id === parseInt(id));
    if (!department) {
      throw new Error("Department not found");
    }
    
    // Get employees for this department
    const employees = await employeeService.getByDepartment(department.name);
    
    return { 
      ...department, 
      employeeCount: employees.length,
      employees 
    };
  },

  async create(departmentData) {
    await delay(400);
    const maxId = Math.max(...departments.map(dept => dept.Id), 0);
    const newDepartment = {
      ...departmentData,
      Id: maxId + 1,
      employeeCount: 0
    };
    departments.push(newDepartment);
    return { ...newDepartment };
  },

  async update(id, departmentData) {
    await delay(350);
    const index = departments.findIndex(dept => dept.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Department not found");
    }
    departments[index] = { ...departments[index], ...departmentData };
    return { ...departments[index] };
  },

  async delete(id) {
    await delay(250);
    const index = departments.findIndex(dept => dept.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Department not found");
    }
    const deletedDepartment = departments.splice(index, 1)[0];
    return { ...deletedDepartment };
  }
};