using System.Drawing;
using System.Threading.Tasks;
using AplikacjaDoPlanowaniaZadan.Server.DataModels;

namespace AplikacjaDoPlanowaniaZadan.Server.DataTransfer.DTO
{
    public class TaskDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DueTo { get; set; }
        public DateTime CreationDate { get; set; }
        public Status Status { get; set; }
        public Priority Priority { get; set; }

        public TaskDTO(DataModels.Task task)
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
