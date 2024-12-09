namespace AplikacjaDoPlanowaniaZadan.Server.DataModels
{
    public class Notification
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime SendDate { get; set; }
        public int UserId { get; set; }
        public User User{ get; set; }
    }
}
