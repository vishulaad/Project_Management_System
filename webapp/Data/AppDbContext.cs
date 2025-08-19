using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using webapp.Models;


using TaskModel = webapp.Models.Task;
using TaskStatusModel = webapp.Models.TaskStatus;

namespace webapp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Company> Companies { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Department> Departments { get; set; } = null!;
        public DbSet<LeaveRequest> LeaveRequests { get; set; } = null!;
        public DbSet<Project> Projects { get; set; } = null!;
        public DbSet<TaskModel> Tasks { get; set; } = null!;
        public DbSet<TaskAssignee> TaskAssignees { get; set; } = null!;
        public DbSet<Subtask> Subtasks { get; set; } = null!;
        public DbSet<ProjectTeamMember> ProjectTeamMembers { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            

            
            var projectStatusConverter = new ValueConverter<ProjectStatus, string>(
                v => v.ToString(),
                v => (ProjectStatus)Enum.Parse(typeof(ProjectStatus), v.Replace(" ", ""))
            );

            
            var taskStatusConverter = new ValueConverter<TaskStatusModel, string>(
                v => v.ToString(),
                v => (TaskStatusModel)Enum.Parse(typeof(TaskStatusModel), v.Replace(" ", ""))
            );

            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            modelBuilder.Entity<User>()
                .Property(u => u.Status)
                .HasConversion<string>();

            modelBuilder.Entity<LeaveRequest>()
                .Property(lr => lr.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Project>()
                .Property(p => p.Status)
                .HasConversion(projectStatusConverter);

            modelBuilder.Entity<TaskModel>()
                .Property(t => t.Status)
                .HasConversion(taskStatusConverter);

            modelBuilder.Entity<TaskModel>()
                .Property(t => t.Priority)
                .HasConversion<string>();

            modelBuilder.Entity<ProjectTeamMember>()
                .Property(ptm => ptm.Role)
                .HasConversion<string>();

            
            modelBuilder.Entity<User>()
                .HasOne(u => u.Company)
                .WithMany(c => c.Users)
                .HasForeignKey(u => u.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Department>()
                .HasMany(d => d.Users)
                .WithOne(u => u.Department)
                .HasForeignKey(u => u.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LeaveRequest>()
                .HasOne(lr => lr.Requestor)
                .WithMany()
                .HasForeignKey(lr => lr.RequestorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LeaveRequest>()
                .HasOne(lr => lr.ActionBy)
                .WithMany()
                .HasForeignKey(lr => lr.ActionById)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
