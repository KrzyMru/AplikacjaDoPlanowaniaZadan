using AplikacjaDoPlanowaniaZadan.Server.DataModels;

namespace AplikacjaDoPlanowaniaZadan.Server.DataTransfer.DTO
{
    public class ListDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Color { get; set; }
        public IList<DataModels.Task> Tasks { get; set; } = new List<DataModels.Task>();

        public ListDTO(List list)
        {
            Id = list.Id;
            Name = list.Name;
            Description = list.Description;
            Color = list.Color;
            Tasks = list.Tasks;
        }
    }
}
