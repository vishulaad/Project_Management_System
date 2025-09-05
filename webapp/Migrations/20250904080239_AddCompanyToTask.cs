using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webapp.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyToTask : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tasks_companies_company_id",
                table: "tasks");

            migrationBuilder.RenameColumn(
                name: "company_id",
                table: "tasks",
                newName: "CompanyId");

            migrationBuilder.RenameIndex(
                name: "IX_tasks_company_id",
                table: "tasks",
                newName: "IX_tasks_CompanyId");

            migrationBuilder.AlterColumn<DateTime>(
                name: "created_at",
                table: "tasks",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CompanyId",
                table: "tasks",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<decimal>(
                name: "actual_hours",
                table: "tasks",
                type: "decimal(65,30)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "estimated_hours",
                table: "tasks",
                type: "decimal(65,30)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "story_id",
                table: "tasks",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "tasks",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "stories",
                columns: table => new
                {
                    story_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    title = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    description = table.Column<string>(type: "text", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    acceptance_criteria = table.Column<string>(type: "text", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    story_points = table.Column<int>(type: "int", nullable: false),
                    priority = table.Column<int>(type: "int", nullable: false),
                    status = table.Column<int>(type: "int", nullable: false),
                    sprint_id = table.Column<int>(type: "int", nullable: true),
                    project_id = table.Column<int>(type: "int", nullable: false),
                    created_by = table.Column<int>(type: "int", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_stories", x => x.story_id);
                    table.ForeignKey(
                        name: "FK_stories_projects_project_id",
                        column: x => x.project_id,
                        principalTable: "projects",
                        principalColumn: "project_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_stories_sprints_sprint_id",
                        column: x => x.sprint_id,
                        principalTable: "sprints",
                        principalColumn: "sprint_id");
                    table.ForeignKey(
                        name: "FK_stories_users_created_by",
                        column: x => x.created_by,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_tasks_story_id",
                table: "tasks",
                column: "story_id");

            migrationBuilder.CreateIndex(
                name: "IX_stories_created_by",
                table: "stories",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "IX_stories_project_id",
                table: "stories",
                column: "project_id");

            migrationBuilder.CreateIndex(
                name: "IX_stories_sprint_id",
                table: "stories",
                column: "sprint_id");

            migrationBuilder.AddForeignKey(
                name: "FK_tasks_companies_CompanyId",
                table: "tasks",
                column: "CompanyId",
                principalTable: "companies",
                principalColumn: "company_id");

            migrationBuilder.AddForeignKey(
                name: "FK_tasks_stories_story_id",
                table: "tasks",
                column: "story_id",
                principalTable: "stories",
                principalColumn: "story_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tasks_companies_CompanyId",
                table: "tasks");

            migrationBuilder.DropForeignKey(
                name: "FK_tasks_stories_story_id",
                table: "tasks");

            migrationBuilder.DropTable(
                name: "stories");

            migrationBuilder.DropIndex(
                name: "IX_tasks_story_id",
                table: "tasks");

            migrationBuilder.DropColumn(
                name: "actual_hours",
                table: "tasks");

            migrationBuilder.DropColumn(
                name: "estimated_hours",
                table: "tasks");

            migrationBuilder.DropColumn(
                name: "story_id",
                table: "tasks");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "tasks");

            migrationBuilder.RenameColumn(
                name: "CompanyId",
                table: "tasks",
                newName: "company_id");

            migrationBuilder.RenameIndex(
                name: "IX_tasks_CompanyId",
                table: "tasks",
                newName: "IX_tasks_company_id");

            migrationBuilder.AlterColumn<DateTime>(
                name: "created_at",
                table: "tasks",
                type: "datetime(6)",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)");

            migrationBuilder.AlterColumn<int>(
                name: "company_id",
                table: "tasks",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_tasks_companies_company_id",
                table: "tasks",
                column: "company_id",
                principalTable: "companies",
                principalColumn: "company_id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
