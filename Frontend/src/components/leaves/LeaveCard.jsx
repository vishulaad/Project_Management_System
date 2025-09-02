import React from "react";
import {
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
} from "lucide-react";
import { useCompany } from "../../contexts/CompanyContext";

export function LeaveCard({ leave }) {
  const { members } = useCompany();

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return CheckCircle;
      case "Rejected":
        return XCircle;
      default:
        return Clock;
    }
  };

  const applicant = members.find((m) => m.id === leave.userId);
  const reviewer = leave.reviewedBy
    ? members.find((m) => m.id === leave.reviewedBy)
    : null;
  const StatusIcon = getStatusIcon(leave.status);

  const calculateDays = () => {
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{applicant?.name}</h3>
            <p className="text-sm text-gray-500">{applicant?.role}</p>
          </div>
        </div>
        <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
          {/* <MoreHorizontal className="w-5 h-5" /> */}
        </button>
      </div>

      {/* Dates & Reason */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>
            {leave.startDate} to {leave.endDate}
          </span>
          <span className="text-gray-400">({calculateDays()} days)</span>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-700">
            <strong>Reason:</strong> {leave.reason}
          </p>
        </div>
      </div>

      {/* Status & Applied Date */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`px-3 py-1 text-sm font-medium rounded-full flex items-center gap-1 ${getStatusColor(
            leave.status
          )}`}>
          <StatusIcon className="w-4 h-4" />
          {leave.status}
        </span>

        <div className="text-sm text-gray-500">Applied: {leave.appliedAt}</div>
      </div>

      {/* Pending or Reviewed Info */}
      {leave.status === "Pending" ? (
        <div className="bg-yellow-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-800">
            Not reviewed yet, please wait
          </p>
        </div>
      ) : (
        leave.reviewedBy &&
        leave.reviewedAt && (
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Reviewed by:</strong> {reviewer?.name} on{" "}
              {leave.reviewedAt}
            </p>
            {leave.reviewNotes && (
              <p className="text-sm text-blue-700 mt-1">{leave.reviewNotes}</p>
            )}
          </div>
        )
      )}
    </div>
  );
}
