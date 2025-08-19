import React, { useState, useEffect } from "react";
import { useCompany } from "../../contexts/CompanyContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TeamMembers() {
  const { members, isLoading, error, getMembers } = useCompany();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [filteredMembers, setFilteredMembers] = useState([]);
  const { user, role, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    if (!authLoading && role === "admin" && user?.companyId) {
      getMembers(user.companyId);
    }
  }, [authLoading, user, role]);

  useEffect(() => {
    if (!members) return;

    const filtered = members.filter((member) => {
      const matchesSearch =
        member.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "All" || member.role === roleFilter;

      return matchesSearch && matchesRole;
    });

    setFilteredMembers(filtered);
  }, [members, searchTerm, roleFilter]);

  return (
    <div className="mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">👥 Team Members</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by name, email, or position"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="All">All Roles</option>
          <option value="admin">Admin</option>
          <option value="department_manager">Department Manager</option>
          <option value="employee">Employee</option>
        </select>
      </div>

      {isLoading || authLoading ? (
        <p className="text-gray-500 text-center mt-10">
          Loading team members...
        </p>
      ) : error ? (
        <p className="text-red-500 text-center mt-10">❌ {error}</p>
      ) : filteredMembers.length > 0 ? (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <li
              key={member.userId}
              className="p-5 border rounded-xl shadow-sm bg-white hover:shadow-md transition">
              <h3 className="font-semibold text-lg text-gray-800">
                {member.firstName} {member.lastName}
              </h3>
              <p className="text-gray-600">{member.email}</p>
              <p className="text-gray-500">{member.position}</p>
              <span className="inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                {member.role}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center mt-10">No members found.</p>
      )}
    </div>
  );
}
