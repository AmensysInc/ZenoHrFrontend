import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [visaDetails, setVisaDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [empRes, poRes, visaRes] = await Promise.all([
          axios.get("http://localhost:8082/employees?page=0&size=10", {
            headers,
          }),
          axios.get("http://localhost:8082/orders?page=0&size=10", { headers }),
          axios.get("http://localhost:8082/visa-details?page=0&size=10", {
            headers,
          }),
        ]);

        setEmployees(empRes.data.content || []);
        setPurchaseOrders(poRes.data.content || []);

        // Sort visas: expiring this month on top
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const sortedVisas = (visaRes.data.content || []).sort((a, b) => {
          const aDate = new Date(a.visaExpiryDate);
          const bDate = new Date(b.visaExpiryDate);

          const aIsThisMonth =
            aDate.getMonth() + 1 === currentMonth &&
            aDate.getFullYear() === currentYear;
          const bIsThisMonth =
            bDate.getMonth() + 1 === currentMonth &&
            bDate.getFullYear() === currentYear;

          if (aIsThisMonth && !bIsThisMonth) return -1;
          if (!aIsThisMonth && bIsThisMonth) return 1;
          return aDate - bDate;
        });

        setVisaDetails(sortedVisas);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const formatDate = (dateArray) => {
    if (!dateArray || dateArray.length < 3) return "N/A";
    const [year, month, day] = dateArray;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  };

  const isExpiringThisMonth = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Summary Cards */}
{/* Summary Row */}
<div className="flex items-center justify-start gap-4 mb-8 bg-white shadow rounded-2xl p-4">
  <span className="text-lg font-semibold">
    Employees: <span className="font-bold text-blue-600">{employees.length}</span>
  </span>

  <span className="text-gray-400">|</span>

  <span className="text-lg font-semibold">
    Orders: <span className="font-bold text-green-600">{purchaseOrders.length}</span>
  </span>

  <span className="text-gray-400">|</span>

  <span className="text-lg font-semibold">
    Visas: <span className="font-bold text-red-600">{visaDetails.length}</span>
  </span>
</div>


          {/* Employees Grid */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-3">Employees</h2>
            <div className="overflow-x-auto bg-white shadow rounded-2xl">
              <table className="table-auto w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border">Phone</th>
                    <th className="p-2 border">Company</th>
                    <th className="p-2 border">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.employeeID} className="hover:bg-gray-50">
                      <td className="p-2 border">{`${emp.firstName} ${emp.lastName}`}</td>
                      <td className="p-2 border">{emp.emailID}</td>
                      <td className="p-2 border">{emp.phoneNo}</td>
                      <td className="p-2 border">
                        {emp.company?.companyName || "N/A"}
                      </td>
                      <td className="p-2 border">
                        {formatDate(emp.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Purchase Orders Grid */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-3">Purchase Orders</h2>
            <div className="overflow-x-auto bg-white shadow rounded-2xl">
              <table className="table-auto w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">Employee Name</th>
                    <th className="p-2 border">Date of Joining</th>
                    <th className="p-2 border">Project End</th>
                    <th className="p-2 border">Bill Rate</th>
                    <th className="p-2 border">Client</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrders.map((po) => (
                    <tr key={po.orderId} className="hover:bg-gray-50">
                      <td className="p-2 border">{po.employeeName}</td>
                      <td className="p-2 border">{po.dateOfJoining}</td>
                      <td className="p-2 border">{po.projectEndDate}</td>
                      <td className="p-2 border">{po.billRate}</td>
                      <td className="p-2 border">{po.endClientName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Visa Details Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-3">Visa Details</h2>
            <div className="overflow-x-auto bg-white shadow rounded-2xl">
              <table className="table-auto w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">Employee Name</th>
                    <th className="p-2 border">Visa Type</th>
                    <th className="p-2 border">Start Date</th>
                    <th className="p-2 border">Expiry Date</th>
                    <th className="p-2 border">I140 Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visaDetails.map((visa) => (
                    <tr key={visa.visaId} className="hover:bg-gray-50">
                      <td className="p-2 border">{visa.employeeName}</td>
                      <td className="p-2 border">{visa.visaType}</td>
                      <td className="p-2 border">{visa.visaStartDate}</td>
                      <td
                        className={`p-2 border ${
                          isExpiringThisMonth(visa.visaExpiryDate)
                            ? "text-red-600 font-bold"
                            : ""
                        }`}
                      >
                        {visa.visaExpiryDate}
                      </td>
                      <td className="p-2 border">{visa.i140Status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
