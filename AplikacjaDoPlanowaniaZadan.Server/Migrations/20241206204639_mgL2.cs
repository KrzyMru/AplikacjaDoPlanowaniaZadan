using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AplikacjaDoPlanowaniaZadan.Server.Migrations
{
    /// <inheritdoc />
    public partial class mgL2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lists_Users_UserId1",
                table: "Lists");

            migrationBuilder.DropIndex(
                name: "IX_Lists_UserId1",
                table: "Lists");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "Lists");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Lists",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "DueTo" },
                values: new object[] { new DateTime(2024, 12, 6, 21, 46, 39, 386, DateTimeKind.Local).AddTicks(4291), new DateTime(2024, 12, 6, 21, 46, 39, 386, DateTimeKind.Local).AddTicks(4339) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreationDate", "DueTo" },
                values: new object[] { new DateTime(2024, 12, 6, 21, 46, 39, 386, DateTimeKind.Local).AddTicks(4341), new DateTime(2024, 12, 7, 21, 46, 39, 386, DateTimeKind.Local).AddTicks(4342) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreationDate", "DueTo" },
                values: new object[] { new DateTime(2024, 12, 6, 21, 46, 39, 386, DateTimeKind.Local).AddTicks(4346), new DateTime(2024, 12, 6, 21, 46, 39, 386, DateTimeKind.Local).AddTicks(4347) });

            migrationBuilder.CreateIndex(
                name: "IX_Lists_UserId",
                table: "Lists",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Lists_Users_UserId",
                table: "Lists",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lists_Users_UserId",
                table: "Lists");

            migrationBuilder.DropIndex(
                name: "IX_Lists_UserId",
                table: "Lists");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Lists",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId1",
                table: "Lists",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "DueTo" },
                values: new object[] { new DateTime(2024, 12, 6, 18, 2, 8, 342, DateTimeKind.Local).AddTicks(1261), new DateTime(2024, 12, 6, 18, 2, 8, 342, DateTimeKind.Local).AddTicks(1276) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreationDate", "DueTo" },
                values: new object[] { new DateTime(2024, 12, 6, 18, 2, 8, 342, DateTimeKind.Local).AddTicks(1277), new DateTime(2024, 12, 7, 18, 2, 8, 342, DateTimeKind.Local).AddTicks(1279) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreationDate", "DueTo" },
                values: new object[] { new DateTime(2024, 12, 6, 18, 2, 8, 342, DateTimeKind.Local).AddTicks(1281), new DateTime(2024, 12, 6, 18, 2, 8, 342, DateTimeKind.Local).AddTicks(1282) });

            migrationBuilder.CreateIndex(
                name: "IX_Lists_UserId1",
                table: "Lists",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Lists_Users_UserId1",
                table: "Lists",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
