namespace AplikacjaDoPlanowaniaZadan.Server.DataTransfer.Requests
{
    public class CreateListRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Color { get; set; }
        public string Icon { get; set; }
        public List<DataModels.Task> Tasks { get; set; } = new List<DataModels.Task>();
    }
}
