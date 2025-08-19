import React, { useState } from "react";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  Briefcase,
  DollarSign,
  Building2,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    position: "",
    salary: "",
    role: "",
    companyId: "",
    departmentId: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [availableCompanies] = useState([
    { id: 1, name: "Dart Inc." },
    { id: 2, name: "CodeX Ltd." },
    { id: 3, name: "TechFlow Solutions" },
    { id: 4, name: "InnovateLab" },
  ]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Registration failed");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-3xl p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 px-3 py-2 border rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 px-3 py-2 border rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Position</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full pl-10 px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Salary</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full pl-10 px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Role</label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10 px-3 py-2 border rounded-lg">
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Company</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                className="w-full pl-10 px-3 py-2 border rounded-lg">
                <option value="">Select company</option>
                {availableCompanies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Department ID</label>
            <input
              type="number"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex justify-center items-center gap-2">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Account
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
