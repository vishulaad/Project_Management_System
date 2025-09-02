using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapp.Models
{
    public enum LeaveStatus
    {
        pending,
        approved,
        rejected
    }

    [Table("leave_requests")]
    public class LeaveRequest
    {
        [Key]
        [Column("request_id")]
        public int RequestId { get; set; }

        [Column("requestor_id")]
        public int RequestorId { get; set; }

        [Required]
        [Column("leave_type", TypeName = "varchar(50)")]
        public string LeaveType { get; set; } = null!;

        [Required]
        [Column("start_date")]
        public DateTime StartDate { get; set; }

        [Required]
        [Column("end_date")]
        public DateTime EndDate { get; set; }

        [Required]
        [Column("reason", TypeName = "text")]
        public string Reason { get; set; } = null!;

        [Required]
        [Column("status")]
        public LeaveStatus Status { get; set; } = LeaveStatus.pending;

        [Column("action_by_id")]
        public int? ActionById { get; set; }

        [Column("action_timestamp")]
        public DateTime? ActionTimestamp { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        // Navigation properties
        [ForeignKey("RequestorId")]
        public User Requestor { get; set; } = null!;

        [ForeignKey("ActionById")]
        public User? ActionBy { get; set; }
    }
}
