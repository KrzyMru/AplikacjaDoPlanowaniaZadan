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

      
        [HttpPost("saveTask")]
        public IActionResult SaveTask([FromBody] DataModels.Task task)
        {
            if (task == null || string.IsNullOrEmpty(task.Name) || string.IsNullOrEmpty(task.Description))
            {
                return BadRequest("Dane zadania są niepoprawne.");
            }

            try
            {
              
                task.Status = Status.Planned;        
                task.Priority = Priority.Medium;     
                task.DueTo = DateTime.Now.AddDays(7); 

                _context.Tasks.Add(task);
                _context.SaveChanges();

                return CreatedAtAction(nameof(SaveTask), new { id = task.Id }, task);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Błąd podczas zapisywania zadania: " + ex.Message);
                return StatusCode(500, "Wystąpił błąd podczas zapisywania zadania.");
            }
        }

     
        [HttpPost("toggleTask")]
        public IActionResult ToggleTask([FromBody] int taskId)
        {
            var task = _context.Tasks.FirstOrDefault(t => t.Id == taskId);
            if (task == null)
            {
                return NotFound("Zadanie nie zostało znalezione.");
            }

            try
            {
               
                switch (task.Status)
                {
                    case Status.Finished:
                        task.Status = Status.Planned;
                        task.DueTo = default; 
                        break;

                    case Status.Planned:
                    case Status.During:
                        task.Status = Status.Finished;
                        task.DueTo = DateTime.Now; 
                        break;

                    default:
                        return BadRequest("Nieznany status zadania.");
                }

                _context.SaveChanges();
                return Ok(task);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Błąd podczas przełączania statusu zadania: " + ex.Message);
                return StatusCode(500, "Wystąpił błąd podczas aktualizacji zadania.");
            }
        }
    }
}
