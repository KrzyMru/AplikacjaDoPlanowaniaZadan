using Microsoft.AspNetCore.Mvc;
using AplikacjaDoPlanowaniaZadan.Server.DataModels;
using Task = AplikacjaDoPlanowaniaZadan.Server.DataModels.Task;

namespace AplikacjaDoPlanowaniaZadan.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : ControllerBase
    {
        private static List<Task> tasks = new List<Task>
        {
            new Task { Id = 1, Name = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean " +
                "commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturie",
                Description = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean " +
                "commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturie" +
                "nt montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem", 
                Status = Status.Planned, Priority = Priority.Medium, DueTo = DateTime.Now },
            new Task { Id = 2, Name = "Praca domowa", Description = "Odrob prace domowa z matematyki i fizyki ", Status = Status.During, Priority = Priority.High, DueTo = DateTime.Now.AddDays(1) },
            new Task { Id = 3, Name = "Przedszkole", 
                Description = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean " +
                "commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturie" +
                "nt montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem" +
                ". Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In e" +
                "nim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer " +
                "tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula,", 
                Status = Status.Finished, Priority = Priority.Low, DueTo = DateTime.Now }
        };

        [HttpGet("todayTasks")]
        public IActionResult GetTodayTasks()
        {

            var today = DateTime.Now.Date;
            var todayTasks = tasks.Where(t => t.DueTo.Date == today).ToList();
            return Ok(todayTasks);
        }

        [HttpDelete("deleteTask")]
        public IActionResult DeleteTask([FromBody] int taskId)
        {
            var task = tasks.FirstOrDefault(t => t.Id == taskId);
            if (task == null)
            {
                return NotFound();
            }

            tasks.Remove(task);
            return NoContent();
        }

        [HttpPost("completeTask")]
        public IActionResult CompleteTask([FromBody] int taskId)
        {
            var task = tasks.FirstOrDefault(t => t.Id == taskId);
            if (task == null)
            {
                return NotFound();
            }

            task.Status = Status.Finished;
            return Ok(task);
        }
    }
}
