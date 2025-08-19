using System;

namespace webapp.DTOs.LeaveRequests
{
    public class LeaveRequestReadDTO
    {
        public int RequestId { get; set; }
        public int RequestorId { get; set; }
        public string LeaveType { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime EndDate   { get; set; }
        public string Reason { get; set; } = null!;
        public string Status { get; set; } = null!;
        public int? ActionById { get; set; }
        public DateTime? ActionTimestamp { get; set; }
        public DateTime? CreatedAt { get; set; }

        // Related
        public string RequestorName { get; set; } = null!;
        public string RequestorEmail { get; set; } = null!;
        public string? ActionByName { get; set; }
    }
}
