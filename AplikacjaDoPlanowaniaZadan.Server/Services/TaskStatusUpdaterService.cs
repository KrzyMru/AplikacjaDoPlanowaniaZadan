using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using AplikacjaDoPlanowaniaZadan.Server.DAL.EF;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using AplikacjaDoPlanowaniaZadan.Server.DataModels;

namespace AplikacjaDoPlanowaniaZadan.Server.Services
{
    public class TaskStatusUpdaterService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly TimeSpan _interval = TimeSpan.FromSeconds(30); 

        public TaskStatusUpdaterService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async System.Threading.Tasks.Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await UpdateOverdueTasks(stoppingToken);
                await System.Threading.Tasks.Task.Delay(_interval, stoppingToken);
            }
        }

        private async System.Threading.Tasks.Task UpdateOverdueTasks(CancellationToken cancellationToken)
        {
            using var scope = _scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            try
            {
                var now = DateTime.Now;

                var overdueTasks = await dbContext.Tasks
                    .Where(t => t.DueTo.HasValue && t.DueTo < now && t.Status != Status.Finished)
                    .ToListAsync(cancellationToken);

                foreach (var task in overdueTasks)
                {
                    task.Status = Status.Finished;
                    Console.WriteLine($"[TaskStatusUpdaterService] Task ID {task.Id} status updated to 'During'.");
                }

                await dbContext.SaveChangesAsync(cancellationToken); 
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[TaskStatusUpdaterService] Error: {ex.Message}");
            }
        }
    }
}
