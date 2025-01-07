using AplikacjaDoPlanowaniaZadan.Server.DataModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Reflection.Metadata;

namespace AplikacjaDoPlanowaniaZadan.Server.DAL.EF
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<DataModels.Task> Tasks { get; set; }
        public DbSet<DataModels.List> Lists { get; set; }
        public DbSet<DataModels.User> Users { get; set; }
        public DbSet<DataModels.Notification> Notifications { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
			base.OnModelCreating(modelBuilder);
			modelBuilder
				.Entity<List>()
				.HasOne(e => e.User)
				.WithMany(x => x.Lists)
				.OnDelete(DeleteBehavior.Cascade); // Usunie wszystkie powiązane Tasks

			// Lub alternatywnie:
			modelBuilder
				.Entity<DataModels.Task>()
				.HasOne(t => t.List)
				.WithMany(l => l.Tasks)
				.OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Restrict); // To zapobiega problemowi cykli
        }
    }
}
