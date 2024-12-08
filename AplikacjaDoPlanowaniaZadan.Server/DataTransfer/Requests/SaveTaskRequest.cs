namespace AplikacjaDoPlanowaniaZadan.Server.DataTransfer.Requests
{
	public class SaveTaskRequest
	{
		public string Name { get; set; }
		public string Description { get; set; }
		public int Priority { get; set; }
		public string DueTo { get; set; }
		public int ListId { get; set; }


	}
}
