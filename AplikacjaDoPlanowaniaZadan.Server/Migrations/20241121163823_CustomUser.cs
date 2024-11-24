using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AplikacjaDoPlanowaniaZadan.Server.Migrations
{
    /// <inheritdoc />
    public partial class CustomUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ListId",
                table: "Tasks",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "Lists",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Notification",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SendDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ApplicationUserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notification", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notification_AspNetUsers_ApplicationUserId",
                        column: x => x.ApplicationUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "DueTo", "ListId" },
                values: new object[] { new DateTime(2024, 11, 21, 17, 38, 22, 935, DateTimeKind.Local).AddTicks(6203), new DateTime(2024, 11, 21, 17, 38, 22, 935, DateTimeKind.Local).AddTicks(6244), null });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreationDate", "DueTo", "ListId" },
                values: new object[] { new DateTime(2024, 11, 21, 17, 38, 22, 935, DateTimeKind.Local).AddTicks(6246), new DateTime(2024, 11, 22, 17, 38, 22, 935, DateTimeKind.Local).AddTicks(6248), null });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreationDate", "DueTo", "ListId" },
                values: new object[] { new DateTime(2024, 11, 21, 17, 38, 22, 935, DateTimeKind.Local).AddTicks(6251), new DateTime(2024, 11, 21, 17, 38, 22, 935, DateTimeKind.Local).AddTicks(6253), null });

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_ListId",
                table: "Tasks",
                column: "ListId");

            migrationBuilder.CreateIndex(
                name: "IX_Lists_ApplicationUserId",
                table: "Lists",
                column: "ApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_ApplicationUserId",
                table: "Notification",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Lists_AspNetUsers_ApplicationUserId",
                table: "Lists",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Lists_ListId",
                table: "Tasks",
                column: "ListId",
                principalTable: "Lists",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lists_AspNetUsers_ApplicationUserId",
                table: "Lists");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Lists_ListId",
                table: "Tasks");

            migrationBuilder.DropTable(
                name: "Notification");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_ListId",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Lists_ApplicationUserId",
                table: "Lists");

            migrationBuilder.DropColumn(
                name: "ListId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "Lists");

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "DueTo" },
                values: new object[] { new DateTime(2024, 11, 20, 14, 26, 36, 677, DateTimeKind.Local).AddTicks(249), new DateTime(2024, 11, 20, 14, 26, 36, 677, DateTimeKind.Local).AddTicks(289) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreationDate", "DueTo" },
                values: new object[] { new DateTime(2024, 11, 20, 14, 26, 36, 677, DateTimeKind.Local).AddTicks(292), new DateTime(2024, 11, 21, 14, 26, 36, 677, DateTimeKind.Local).AddTicks(294) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreationDate", "DueTo" },
                values: new object[] { new DateTime(2024, 11, 20, 14, 26, 36, 677, DateTimeKind.Local).AddTicks(297), new DateTime(2024, 11, 20, 14, 26, 36, 677, DateTimeKind.Local).AddTicks(299) });
        }
    }
}
