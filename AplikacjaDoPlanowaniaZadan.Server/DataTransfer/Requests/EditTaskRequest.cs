using AplikacjaDoPlanowaniaZadan.Server.DataModels;
using System.ComponentModel.DataAnnotations;

namespace AplikacjaDoPlanowaniaZadan.Server.DataTransfer.Requests
{
	public class EditTaskRequest
	{
        public int listId;
        public string listName;
        public string listColor;
		public string listIcon;
        public int id;
        [Required]
        public string name;
        [Required]
        public string description;
        public DateTime dueTo;
        public DateTime creationDate;
        public Status status;
        public Priority priority;
    }
}
