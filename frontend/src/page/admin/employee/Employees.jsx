import React, { useEffect, useState } from "react";
import { request } from "../../../utils/request";
import config from "../../../utils/config";

function Employees() {

  const [employees , setEmployees] = useState([])

  const handleGetEmployees = async () => {

    const res = await request("/getemployee", "GET");
    console.log(res);
    if(res && res.employees) {
      setEmployees(res.employees)
    }
  };
  useEffect(() => {
    handleGetEmployees();
  }, []);
  return (
    <div className="w-full p-10">
      <div className="w-auto bg-white drop-shadow-2xl rounded-2xl">
        <h1 className="text-3xl font-bold pt-5 pl-5 text-main">
          EMPLOYEES MANAGEMENT
        </h1>

        <form className="flex gap-5 mr-10 pt-5 pl-5 items-baseline">
          <h1 className="text-2xl font-semibold">Search</h1>
          <input
            className="p-2 border text-1 w-60"
            placeholder="Search"
            type="text"
          />
          <button className="w-20 bg-main p-2 text-white text-1xl" type="submit">
            Search
          </button>
        </form>

        <div className="p-5">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th>First Name</th>
                <th>Last Name</th>
                <th>Full Name</th>
                <th>Phone</th>
                <th>Date Of Birth</th>
                <th>Hire Date</th>
                <th>Image</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="">
              {employees.map((emp, idx) => (
                <tr key={idx} className="gap-5">
                  <td className="text-center">{emp.first_name}</td>
                  <td className="text-center">{emp.last_name}</td>
                  <td className="text-center">{emp.full_name}</td>
                  <td className="text-center">{emp.phone}</td>
                  <td className="text-center">{emp.date_of_birth}</td>
                  <td className="text-center">{emp.hire_date}</td>
                  <td className="flex items-center justify-center p-2">
                    {emp.image&& (
                      <img
                        src={config.image_url + emp.image}
                        alt={emp.full_name}
                        className="w-10 h-10 rounded-full object-cover flex items-center justify-center "
                      />
                    ) }
                  </td>
                  <td className="text-center">{emp.status === 1 ? "Active" : "Inactive"}</td>
                  <td className="text-center">
                    <button className="w-20 bg-main p-1 mr-2 rounded-[10%] text-text-white">Edit</button>
                    <button className="w-20 bg-red-600 p-1 mr-2 rounded-[10%] text-text-white">Delete</button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

}

export default Employees;
