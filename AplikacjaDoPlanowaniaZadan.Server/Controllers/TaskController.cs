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
            new Task { Id = 1, Name = "Zakupy", Description = "Kup mleko chleb i wode", Status = Status.Planned, Priority = Priority.Medium, DueTo = DateTime.Now },
            new Task { Id = 2, Name = "Praca domowa", Description = "Odrob prace domowa z matematyki i fizyki ", Status = Status.During, Priority = Priority.High, DueTo = DateTime.Now.AddDays(1) },
            new Task { Id = 3, Name = "Przedszkole", Description = "Odbierz dziecko z przedszkola o 15:00", Status = Status.Finished, Priority = Priority.Low, DueTo = DateTime.Now }
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
