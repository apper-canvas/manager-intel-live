import React, { useState } from "react";
import AddEmployeeModal from "@/components/organisms/AddEmployeeModal";
import EmployeeTable from "@/components/organisms/EmployeeTable";

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
<div className="h-full flex flex-col">
      <EmployeeTable onAddEmployee={handleAddEmployee} key={refreshKey} />
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onEmployeeAdded={handleEmployeeAdded}
      />
    </div>
  );
};

export default Employees;