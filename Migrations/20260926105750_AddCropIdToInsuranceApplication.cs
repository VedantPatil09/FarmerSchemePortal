using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FarmerScheme.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCropIdToInsuranceApplication : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CropId",
                table: "InsuranceApplications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 9, 26, 10, 57, 48, 150, DateTimeKind.Utc).AddTicks(551));

            migrationBuilder.CreateIndex(
                name: "IX_InsuranceApplications_CropId",
                table: "InsuranceApplications",
                column: "CropId");

            migrationBuilder.AddForeignKey(
                name: "FK_InsuranceApplications_Crops_CropId",
                table: "InsuranceApplications",
                column: "CropId",
                principalTable: "Crops",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InsuranceApplications_Crops_CropId",
                table: "InsuranceApplications");

            migrationBuilder.DropIndex(
                name: "IX_InsuranceApplications_CropId",
                table: "InsuranceApplications");

            migrationBuilder.DropColumn(
                name: "CropId",
                table: "InsuranceApplications");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 8, 5, 3, 8, 588, DateTimeKind.Utc).AddTicks(5252));
        }
    }
}
