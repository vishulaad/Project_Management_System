import React, { useDebugValue, useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useLeaves } from "../../contexts/LeaveContext";
import { LeaveCard } from "./LeaveCard";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
export function LeavesPage() {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const { leaves } = useLeaves();
  const { user, role, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const filteredLeaves = leaves.filter((leave) => {
    const matchesSearch = leave.reason
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || leave.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = ["All", "Pending", "Approved", "Rejected"];

  const stats = [
    {
      name: "Pending Requests",
      value: leaves.filter((l) => l.status === "Pending").length,
      icon: Clock,
      color: "yellow",
    },
    {
      name: "Approved",
      value: leaves.filter((l) => l.status === "Approved").length,
      icon: CheckCircle,
      color: "green",
    },
    {
      name: "Rejected",
      value: leaves.filter((l) => l.status === "Rejected").length,
      icon: XCircle,
      color: "red",
    },
  ];

  const statColorClasses = {
    yellow: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      mainText: "text-yellow-600",
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-700",
      mainText: "text-green-600",
    },
    red: { bg: "bg-red-100", text: "text-red-700", mainText: "text-red-600" },
  };

  return (
    // Changed: Applied the main theme background and padding
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          {/* Changed: Header text colors updated to the blue theme */}
          <h1 className="text-2xl font-bold text-blue-950">Leave Status</h1>
          <p className="text-blue-800">Check leaves status</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search leave requests..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50">
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Leaves Grid */}
      {/* Note: The <LeaveCard> component should also be styled with the white card theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeaves.map((leave) => (
          <LeaveCard key={leave.id} leave={leave} />
        ))}
      </div>

      {filteredLeaves.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100/70 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-blue-950 mb-2">
            No leave requests found
          </h3>
          <p className="text-blue-700 mb-4">
            {searchTerm || statusFilter !== "All"
              ? "Try adjusting your search or filters"
              : "Apply for your first leave request"}
          </p>
        </div>
      )}
    </div>
  );
}
