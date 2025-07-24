import employeesData from "@/services/mockData/employees.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let employees = [...employeesData];

export const employeeService = {
  async getAll() {
    await delay(300);
    return [...employees];
  },

  async getById(id) {
    await delay(200);
    const employee = employees.find(emp => emp.Id === parseInt(id));
    if (!employee) {
      throw new Error("Employee not found");
    }
    return { ...employee };
  },

  async create(employeeData) {
    await delay(400);
    const maxId = Math.max(...employees.map(emp => emp.Id), 0);
    const newEmployee = {
      ...employeeData,
      Id: maxId + 1,
      status: "Active"
    };
    employees.push(newEmployee);
    return { ...newEmployee };
  },

  async update(id, employeeData) {
    await delay(350);
    const index = employees.findIndex(emp => emp.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Employee not found");
    }
    employees[index] = { ...employees[index], ...employeeData };
    return { ...employees[index] };
  },

  async delete(id) {
    await delay(250);
    const index = employees.findIndex(emp => emp.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Employee not found");
    }
    const deletedEmployee = employees.splice(index, 1)[0];
    return { ...deletedEmployee };
  },

  async getByDepartment(department) {
    await delay(300);
    return employees.filter(emp => emp.department === department);
  },

  async search(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return employees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm) ||
      emp.position.toLowerCase().includes(searchTerm) ||
      emp.department.toLowerCase().includes(searchTerm)
    );
  }
};