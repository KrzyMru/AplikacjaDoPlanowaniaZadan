using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AplikacjaDoPlanowaniaZadan.Server.Migrations
{
    /// <inheritdoc />
    public partial class inicjalizacja : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Tasks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DueTo = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Priority = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tasks", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Tasks",
                columns: new[] { "Id", "CreationDate", "Description", "DueTo", "Name", "Priority", "Status" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 10, 30, 18, 59, 0, 642, DateTimeKind.Local).AddTicks(1181), "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem", new DateTime(2024, 10, 30, 18, 59, 0, 642, DateTimeKind.Local).AddTicks(1220), "Dupa jasiu pierdzi stasiu... Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturie", 1, 0 },
                    { 2, new DateTime(2024, 10, 30, 18, 59, 0, 642, DateTimeKind.Local).AddTicks(1222), "Odrob prace domowa z matematyki i fizyki ", new DateTime(2024, 10, 31, 18, 59, 0, 642, DateTimeKind.Local).AddTicks(1224), "Praca domowa", 2, 1 },
                    { 3, new DateTime(2024, 10, 30, 18, 59, 0, 642, DateTimeKind.Local).AddTicks(1229), "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula,", new DateTime(2024, 10, 30, 18, 59, 0, 642, DateTimeKind.Local).AddTicks(1231), "Przedszkole", 0, 2 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tasks");
        }
    }
}
