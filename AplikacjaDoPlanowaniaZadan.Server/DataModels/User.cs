using Microsoft.AspNetCore.Identity;

namespace AplikacjaDoPlanowaniaZadan.Server.DataModels
{
	public class User
	{
        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public IList<List> Lists { get; set; } = new List<List>();
		public IList<Notification> Notifications { get; set; } = new List<Notification>();
	}
}
