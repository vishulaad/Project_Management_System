using System;

namespace webapp.DTOs.LeaveRequests
{
    public class LeaveRequestCreateDTO
    {
        public int RequestorId { get; set; }
        public string LeaveType { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime EndDate   { get; set; }
        public string Reason { get; set; } = null!;
        // Status default pending; action fields server set karega
    }
}
