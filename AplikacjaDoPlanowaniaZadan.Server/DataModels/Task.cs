using System.ComponentModel.DataAnnotations;

namespace AplikacjaDoPlanowaniaZadan.Server.DataModels
{
    public class Task
    {
        public int Id { get; set; }
        public string Name { get; set; }
		public string Description { get; set; }
		public DateTime? DueTo { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;
        public Status Status { get; set; }
        public Priority Priority { get; set; }

        public int? ListId { get; set; }
        public virtual List? List { get; set; }

		public Task(){}

		public Task(Task task)
		{
			Id = task.Id;
			Name = task.Name;
			Description = task.Description;
			Priority = task.Priority;
			DueTo = task.DueTo;
			CreationDate = task.CreationDate;
			Status = task.Status;
			Priority = task.Priority;
		}
	}
}
