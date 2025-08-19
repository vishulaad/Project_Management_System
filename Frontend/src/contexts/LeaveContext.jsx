import React, { createContext, useContext, useState } from "react";

const LeaveContext = createContext(undefined);

export function LeaveProvider({ children }) {
  const [leaves, setLeaves] = useState([
    {
      id: 1,
      userId: 2,
      startDate: "2024-02-20",
      endDate: "2024-02-25",
      reason: "Family vacation",
      status: "Pending",
      appliedAt: "2024-02-10",
    },
    {
      id: 2,
      userId: 3,
      startDate: "2024-02-15",
      endDate: "2024-02-16",
      reason: "Medical appointment",
      status: "Approved",
      appliedAt: "2024-02-05",
      reviewedBy: 1,
      reviewedAt: "2024-02-06",
      reviewNotes: "Approved for medical reasons",
    },
  ]);

  return (
    <LeaveContext.Provider
      value={{
        leaves,
      }}>
      {children}
    </LeaveContext.Provider>
  );
}

export function useLeaves() {
  const context = useContext(LeaveContext);
  if (context === undefined) {
    throw new Error("useLeaves must be used within a LeaveProvider");
  }
  return context;
}
