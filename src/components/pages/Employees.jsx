import React, { useState } from "react";
import EmployeeTable from "@/components/organisms/EmployeeTable";
import AddEmployeeModal from "@/components/organisms/AddEmployeeModal";

const Employees = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddEmployee = () => {
    setIsAddModalOpen(true);
  };

  const handleEmployeeAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div>
      <EmployeeTable 
        key={refreshKey}
        onAddEmployee={handleAddEmployee}
      />
      
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onEmployeeAdded={handleEmployeeAdded}
      />
    </div>
  );
};

export default Employees;