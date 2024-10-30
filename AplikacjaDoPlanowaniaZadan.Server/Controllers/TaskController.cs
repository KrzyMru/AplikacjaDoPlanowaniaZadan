using Microsoft.AspNetCore.Mvc;
using AplikacjaDoPlanowaniaZadan.Server.DataModels;
using Task = AplikacjaDoPlanowaniaZadan.Server.DataModels.Task;
using AplikacjaDoPlanowaniaZadan.Server.DAL.EF;

namespace AplikacjaDoPlanowaniaZadan.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TaskController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("todayTasks")]
        public IActionResult GetTodayTasks()
        {

            var today = DateTime.Now.Date;
            var todayTasks = _context.Tasks.Where(t => t.DueTo.Date == today).ToList();
            return Ok(todayTasks);
        }

        [HttpDelete("deleteTask")]
        public IActionResult DeleteTask([FromBody] int taskId)
        {
            var task = _context.Tasks.FirstOrDefault(t => t.Id == taskId);
            if (task == null)
            {
                return NotFound();
            }

            _context.Tasks.Remove(task);
            _context.SaveChanges();
            return NoContent();
        }

        [HttpPost("completeTask")]
        public IActionResult CompleteTask([FromBody] int taskId)
        {
            var task = _context.Tasks.FirstOrDefault(t => t.Id == taskId);
            if (task == null)
            {
                return NotFound();
            }

            task.Status = Status.Finished;
            _context.SaveChanges();
            return Ok(task);
        }
    }
}
