using AplikacjaDoPlanowaniaZadan.Server.DAL.EF;
using Microsoft.EntityFrameworkCore;

namespace AplikacjaDoPlanowaniaZadan.Server.Extensions
{
	public static class MigrationExtensions
	{
		public static void ApplyMigrations(this IApplicationBuilder app)
		{
			using IServiceScope scope = app.ApplicationServices.CreateScope();
			using ApplicationDbContext context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
			context.Database.Migrate();
		}
	}
}
