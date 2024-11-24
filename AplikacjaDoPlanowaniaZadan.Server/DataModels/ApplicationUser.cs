using Microsoft.AspNetCore.Identity;

namespace AplikacjaDoPlanowaniaZadan.Server.DataModels
{
	public class ApplicationUser : IdentityUser
	{
		public IList<List> Lists { get; set; }
		public IList<Notification> Notifications { get; set; }
	}
}
