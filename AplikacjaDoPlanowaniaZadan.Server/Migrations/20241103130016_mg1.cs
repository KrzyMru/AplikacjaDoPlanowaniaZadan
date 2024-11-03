using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AplikacjaDoPlanowaniaZadan.Server.Migrations
{
    /// <inheritdoc />
    public partial class mg1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Lists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lists", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "DueTo" },
                values: new object[] { new DateTime(2024, 11, 3, 14, 0, 16, 246, DateTimeKind.Local).AddTicks(9217), new DateTime(2024, 11, 3, 14, 0, 16, 246, DateTimeKind.Local).AddTicks(9259) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreationDate", "DueTo" },
                values: new object[] { new DateTime(2024, 11, 3, 14, 0, 16, 246, DateTimeKind.Local).AddTicks(9262), new DateTime(2024, 11, 4, 14, 0, 16, 246, DateTimeKind.Local).AddTicks(9264) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreationDate", "DueTo" },
                values: new object[] { new DateTime(2024, 11, 3, 14, 0, 16, 246, DateTimeKind.Local).AddTicks(9268), new DateTime(2024, 11, 3, 14, 0, 16, 246, DateTimeKind.Local).AddTicks(9270) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Lists");

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "DueTo" },
                values: new object[] { new DateTime(2024, 10, 30, 18, 59, 0, 642, DateTimeKind.Local).AddTicks(1181), new DateTime(2024, 10, 30, 18, 59, 0, 642, DateTimeKind.Local).AddTicks(1220) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreationDate", "DueTo" },
                values: new object[] { new DateTime(2024, 10, 30, 18, 59, 0, 642, DateTimeKind.Local).AddTicks(1222), new DateTime(2024, 10, 31, 18, 59, 0, 642, DateTimeKind.Local).AddTicks(1224) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreationDate", "DueTo" },
                values: new object[] { new DateTime(2024, 10, 30, 18, 59, 0, 642, DateTimeKind.Local).AddTicks(1229), new DateTime(2024, 10, 30, 18, 59, 0, 642, DateTimeKind.Local).AddTicks(1231) });
        }
    }
}
