namespace AplikacjaDoPlanowaniaZadan.Server.DataModels
{
    public class List
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Color { get; set; }
		public string Icon { get; set; }

        public List<Task> Tasks { get; set; } = new List<Task>();

        public int? UserId { get; set; }
        public virtual User? User { get; set; }

		public List() { }

		public List(List list)
		{
			Id = list.Id;
			Name = list.Name;
			Description = list.Description;
			Color = list.Color;
			Icon = list.Icon;
			Tasks = list.Tasks;
		}
	}
}
