using Microsoft.AspNetCore.Mvc;
using AplikacjaDoPlanowaniaZadan.Server.DataModels;
using Task = AplikacjaDoPlanowaniaZadan.Server.DataModels.Task;
using AplikacjaDoPlanowaniaZadan.Server.DAL.EF;
using System.Globalization;
using AplikacjaDoPlanowaniaZadan.Server.DataTransfer.Requests;
using Microsoft.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
using AplikacjaDoPlanowaniaZadan.Server.DataTransfer.DTO;

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
			// token, trzeba tego użyć wszędzie
			var token = Request.Headers[HeaderNames.Authorization].FirstOrDefault()?.Split(" ").Last();
			var handler = new JwtSecurityTokenHandler();
			var decodedToken = handler.ReadJwtToken(token);
			var email = decodedToken.Claims.First(claim => claim.Type == "email").Value;

			var user = _context.Users
				.Where(user => user.Email == email)
				.Include(user => user.Lists)
				.FirstOrDefault();
			if (user == null)
			{
				return BadRequest();
			}
            var todayTasks = _context.Tasks.Where(t => t.DueTo.Date == DateTime.Now.Date && t.List.UserId== user.Id).Select(x=> new
            {
                x.Id,
                x.Name,
                x.Description,
                x.DueTo
            });
            return Ok(todayTasks);
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
				var token = Request.Headers[HeaderNames.Authorization].FirstOrDefault()?.Split(" ").Last();
				var handler = new JwtSecurityTokenHandler();
				var decodedToken = handler.ReadJwtToken(token);
				var email = decodedToken.Claims.First(claim => claim.Type == "email").Value;

				var user = _context.Users
					.Where(user => user.Email == email)
					.Include(user => user.Lists)
					.FirstOrDefault();
				if (user == null)
				{
					return BadRequest();
				}

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

                var ret = _context.Lists.FirstOrDefault(y => y.Id == request.ListId).Tasks
                .Where(x => x.Id == task.Id)
                .Select(t => new
                {
                    t.Id,
                    t.Name,
                    t.Description,
                    t.DueTo,
                    t.CreationDate,
                    t.Priority,
                    t.Status
                }).ToList();
			    return Ok(ret);
            }
			catch (Exception ex)
			{
				Console.WriteLine("Błąd podczas zapisywania zadania: " + ex.Message);
				return StatusCode(500, "Wystąpił błąd podczas zapisywania zadania.");
			}
		}


		[HttpDelete("deleteTask")]
        public IActionResult DeleteTask([FromBody] int taskId)
        {
			var token = Request.Headers[HeaderNames.Authorization].FirstOrDefault()?.Split(" ").Last();
			var handler = new JwtSecurityTokenHandler();
			var decodedToken = handler.ReadJwtToken(token);
			var email = decodedToken.Claims.First(claim => claim.Type == "email").Value;

			var user = _context.Users
				.Where(user => user.Email == email)
				.Include(user => user.Lists)
				.FirstOrDefault();
			if (user == null)
			{
				return BadRequest();
			}

			var task = _context.Tasks.Where(x=>x.List.UserId == user.Id).FirstOrDefault(t => t.Id == taskId);

            if (task == null)
            {
                return NotFound(new { success = false, message = "Task not found." });
            }

            _context.Tasks.Remove(task);
            _context.SaveChanges();

            return Ok(new { success = true, message = "Task deleted successfully." });
        }




        [HttpPost("getDayTasks")]
        public IActionResult GetDayTasks([FromBody] DateTime requestDate)
        {
            var token = Request.Headers[HeaderNames.Authorization].FirstOrDefault()?.Split(" ").Last();
			var handler = new JwtSecurityTokenHandler();
			var decodedToken = handler.ReadJwtToken(token);
			var email = decodedToken.Claims.First(claim => claim.Type == "email").Value;

			var user = _context.Users
				.Where(user => user.Email == email)
				.Include(user => user.Lists)
				.FirstOrDefault();
			if (user == null)
			{
				return BadRequest();
			}

            var tasksForDay = _context.Tasks
                .Where(t => t.DueTo.Date == requestDate.Date)  
                .ToList();

            var tasks = tasksForDay.Where(x => user.Lists.Any(y=>y.Id == x.ListId)).Select(x => new
			{
				x.Id,
				x.Name,
				x.Description,
				x.DueTo
			});

			if (tasks == null || !tasks.Any())
            {
                return NotFound(new { message = "No tasks found for the given date." });
            }

            return Ok(tasks);  
        }



        [HttpPost("getMonthTaskCounts")]
        public IActionResult GetMonthTaskCounts([FromBody] MonthTaskRequest request)
        {
			var token = Request.Headers[HeaderNames.Authorization].FirstOrDefault()?.Split(" ").Last();
			var handler = new JwtSecurityTokenHandler();
			var decodedToken = handler.ReadJwtToken(token);
			var email = decodedToken.Claims.First(claim => claim.Type == "email").Value;

			var user = _context.Users
				.Where(user => user.Email == email)
				.Include(user => user.Lists)
				.FirstOrDefault();
			if (user == null)
			{
				return BadRequest();
			}

			var firstDayOfMonth = new DateTime(request.Date.Year, request.Date.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

            var tasksInMonth = _context.Tasks
                .Where(t => t.DueTo >= firstDayOfMonth && t.DueTo <= lastDayOfMonth).Where(x=> user.Lists.Any(y=>y.Id == x.ListId))
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
                var due2 = task.DueTo;
                switch (task.Status)
                {
                    case Status.Finished:
                        task.Status = Status.Planned;
                        task.DueTo = task.DueTo; 
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
