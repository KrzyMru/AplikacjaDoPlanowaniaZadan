namespace AplikacjaDoPlanowaniaZadan.Server.DataModels
{
    public class Task
    {
        public int Id { get; set; }
        public string Name { get; set; } 
        public string Description { get; set; }
        public DateTime DueTo { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;
        public Status Status { get; set; }
        public Priority Priority { get; set; }
    }
}
