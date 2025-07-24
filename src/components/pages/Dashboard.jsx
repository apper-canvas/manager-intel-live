import React, { useState, useEffect } from "react";
import { employeeService } from "@/services/api/employeeService";
import { departmentService } from "@/services/api/departmentService";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { format, parseISO } from "date-fns";
import Chart from "react-apexcharts";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    departmentCounts: {},
    recentHires: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [employees, departments] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll()
      ]);

      // Calculate department counts using database field names
      const departmentCounts = {};
      employees.forEach(emp => {
        departmentCounts[emp.department_c] = (departmentCounts[emp.department_c] || 0) + 1;
      });

      // Get recent hires (last 30 days) using database field names
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentHires = employees
        .filter(emp => new Date(emp.start_date_c) >= thirtyDaysAgo)
        .sort((a, b) => new Date(b.start_date_c) - new Date(a.start_date_c))
        .slice(0, 5);

      setDashboardData({
        totalEmployees: employees.length,
        departmentCounts,
        recentHires
      });
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Chart configuration
  const chartOptions = {
    chart: {
      type: "donut",
      toolbar: { show: false }
    },
    colors: ["#06b6d4", "#0891b2", "#0e7490", "#164e63", "#22d3ee", "#67e8f9", "#a5f3fc"],
    labels: Object.keys(dashboardData.departmentCounts),
    legend: {
      position: "bottom",
      fontSize: "14px"
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%"
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return Math.round(val) + "%";
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " employees";
        }
      }
    }
  };

  const chartSeries = Object.values(dashboardData.departmentCounts);

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here"s an overview of your HR metrics.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={dashboardData.totalEmployees}
          icon="Users"
          gradient="from-blue-500 to-blue-600"
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          title="Departments"
          value={Object.keys(dashboardData.departmentCounts).length}
          icon="Building2"
          gradient="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Recent Hires"
          value={dashboardData.recentHires.length}
          icon="UserPlus"
          gradient="from-green-500 to-green-600"
          trend="up"
          trendValue="+25%"
        />
        <StatCard
          title="Active Projects"
          value="8"
          icon="Briefcase"
          gradient="from-orange-500 to-orange-600"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution Chart */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-primary-600">
              <ApperIcon name="PieChart" className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Department Distribution</h3>
          </div>
          
          {chartSeries.length > 0 ? (
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="donut"
              height={320}
            />
          ) : (
            <div className="flex items-center justify-center h-80 text-gray-500">
              <div className="text-center">
                <ApperIcon name="PieChart" className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No department data available</p>
              </div>
            </div>
          )}
        </Card>

        {/* Recent Hires */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600">
              <ApperIcon name="UserPlus" className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Hires</h3>
          </div>

          <div className="space-y-4">
{dashboardData.recentHires.length > 0 ? (
              dashboardData.recentHires.map((employee) => (
                <div key={employee.Id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-primary-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {employee.Name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {employee.Name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {employee.position_c} • {employee.department_c}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(parseISO(employee.start_date_c), "MMM dd")}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Users" className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No recent hires</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600">
            <ApperIcon name="Zap" className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Add Employee", icon: "UserPlus", color: "from-blue-500 to-blue-600" },
            { title: "Create Department", icon: "Building2", color: "from-purple-500 to-purple-600" },
            { title: "Generate Report", icon: "FileText", color: "from-green-500 to-green-600" },
            { title: "View Analytics", icon: "BarChart3", color: "from-orange-500 to-orange-600" }
          ].map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
            >
              <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} group-hover:scale-110 transition-transform`}>
                <ApperIcon name={action.icon} className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {action.title}
              </span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;