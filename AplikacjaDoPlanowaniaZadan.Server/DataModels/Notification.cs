namespace AplikacjaDoPlanowaniaZadan.Server.DataModels
{
    public class Notification
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime SendDate { get; set; }
    }
}
