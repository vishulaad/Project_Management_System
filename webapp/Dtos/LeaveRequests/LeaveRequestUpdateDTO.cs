using System;

namespace webapp.DTOs.LeaveRequests
{
    public class LeaveRequestUpdateDTO
    {
        // Requestor edits
        public string? LeaveType { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate   { get; set; }
        public string? Reason { get; set; }

        // Manager actions
        public string? Status { get; set; }           // pending/approved/rejected
        public int? ActionById { get; set; }
        public DateTime? ActionTimestamp { get; set; }
    }
}
