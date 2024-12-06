using AplikacjaDoPlanowaniaZadan.Server.DataModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;

namespace AplikacjaDoPlanowaniaZadan.Server.DAL.EF
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<DataModels.Task> Tasks { get; set; }
        public DbSet<DataModels.List> Lists { get; set; }
        public DbSet<DataModels.User> Users { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<DataModels.Task>().HasData(
                new DataModels.Task
                {
                    Id = 1,
                    Name = "Dupa jasiu pierdzi stasiu... Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean " +
                                "commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturie",
                    Description = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean " +
                                "commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturie" +
                                "nt montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem",
                    Status = Status.Planned,
                    Priority = Priority.Medium,
                    DueTo = DateTime.Now
                },
                new DataModels.Task { Id = 2, Name = "Praca domowa", Description = "Odrob prace domowa z matematyki i fizyki ", Status = Status.During, Priority = Priority.High, DueTo = DateTime.Now.AddDays(1) },
                new DataModels.Task
                {
                    Id = 3,
                    Name = "Przedszkole",
                    Description = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean " +
                    "commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturie" +
                    "nt montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem" +
                    ". Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In e" +
                    "nim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer " +
                    "tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula,",
                    Status = Status.Finished,
                    Priority = Priority.Low,
                    DueTo = DateTime.Now
                }
               );
        }
    }
}
