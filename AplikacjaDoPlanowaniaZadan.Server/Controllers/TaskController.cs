using Microsoft.AspNetCore.Mvc;
using AplikacjaDoPlanowaniaZadan.Server.DataModels;
using Task = AplikacjaDoPlanowaniaZadan.Server.DataModels.Task;
using AplikacjaDoPlanowaniaZadan.Server.DAL.EF;
using System.Globalization;

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


        
        public class SaveTaskRequest
        {
            public string Name { get; set; }
            public string Description { get; set; }
            public int Priority { get; set; }
            public string DueTo { get; set; }
            public int ListId { get; set; }


        }
        [HttpPost("saveTask")]
        public IActionResult SaveTask([FromBody] SaveTaskRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.Description))
            {
                return BadRequest("Dane zadania są niepoprawne.");
            }

            try
            {
                DateTime dateTime2 = DateTime.Parse(request.DueTo);
                var task = new Task
                {
                    Name = request.Name,
                    Description = request.Description,
                    Priority = (Priority)request.Priority,
                    DueTo = dateTime2,
                    Status = Status.Planned,
                    ListId = request.ListId
                };

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


        [HttpDelete("deleteTask")]
        public IActionResult DeleteTask(int taskId)
        {
            var task = _context.Tasks.FirstOrDefault(t => t.Id == taskId);

            if (task == null)
            {
                return NotFound("Task not found.");
            }

            _context.Tasks.Remove(task);
            _context.SaveChanges();

            return Ok(new { success = true, message = "Task deleted successfully." });
        }

        [HttpPost("getDayTasks")]
        public IActionResult GetDayTasks([FromBody] DateTime requestDate)
        {
            var tasksForDay = _context.Tasks
                .Where(t => t.DueTo.Date == requestDate.Date)  
                .ToList();

            if (tasksForDay == null || !tasksForDay.Any())
            {
                return NotFound(new { message = "No tasks found for the given date." });
            }

            return Ok(tasksForDay);  
        }

        public class MonthTaskRequest
        {
            public DateTime Date { get; set; }
            public int DaysInMonth { get; set; }
        }

        [HttpPost("getMonthTaskCounts")]
        public IActionResult GetMonthTaskCounts([FromBody] MonthTaskRequest request)
        {
            var firstDayOfMonth = new DateTime(request.Date.Year, request.Date.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

            var tasksInMonth = _context.Tasks
                .Where(t => t.DueTo >= firstDayOfMonth && t.DueTo <= lastDayOfMonth)
                .GroupBy(t => t.DueTo.Day)  
                .ToList();

            var taskCounts = tasksInMonth.ToDictionary(
                g => g.Key,  
                g => g.Count()  
            );

            return Ok(taskCounts);
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
