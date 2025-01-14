using Microsoft.AspNetCore.Mvc;
using AplikacjaDoPlanowaniaZadan.Server.DataModels;
using Task = AplikacjaDoPlanowaniaZadan.Server.DataModels.Task;
using AplikacjaDoPlanowaniaZadan.Server.DAL.EF;
using System.Globalization;
using AplikacjaDoPlanowaniaZadan.Server.DataTransfer.Requests;
using Microsoft.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata.Ecma335;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Collections.Generic;
using System.Linq;
using AplikacjaDoPlanowaniaZadan.Server.Migrations;
using Microsoft.AspNetCore.Authorization;

namespace AplikacjaDoPlanowaniaZadan.Server.Controllers
{
	[Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TaskController(ApplicationDbContext context)
        {
            _context = context;
        }

        private void updateTasks()
        {
            try
            {
                var now = DateTime.Now;
                
                var overdueTasks = _context.Tasks
                    .Where(t => t.DueTo.HasValue && t.DueTo < now && t.Status != Status.Finished)
                    .ToList();               
                foreach (var task in overdueTasks)
                {
                    task.Status = Status.During; 
                    Console.WriteLine($"[TaskController] Task ID {task.Id} status updated to 'During'.");
                }

                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[TaskController] Error in UpdateOverdueTasks: {ex.Message}");
            }
        }


        [HttpGet("todayTasks")]
        public IActionResult GetTodayTasks()
        {
            updateTasks();
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

			var tasksWithFlattenedListDetails = _context.Tasks
				.Where(t => t.DueTo.Value.Date == DateTime.Today.Date && t.List.UserId == user.Id)
				.Include(t => t.List)
				.Select(t => new
				{
					ListId = t.List.Id,
					ListName = t.List.Name,
					ListColor = t.List.Color,
					ListIcon = t.List.Icon,
					t.Id,
					t.Name,
					t.Description,
					t.DueTo,
					t.CreationDate,
					t.Status,
					t.Priority
				})
				.ToList();

			return Ok(tasksWithFlattenedListDetails);
        }

        [HttpPost("saveTask")]
        public IActionResult SaveTask([FromBody] SaveTaskRequest request)
        {
            try
            {
				if(request.Name.IsNullOrEmpty() || request.Description.IsNullOrEmpty())
				{
					return BadRequest();
				}
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

				//if (request.DueTo != null) {
				DateTime dateTime2;
                DateTime? dateTime;
                if (DateTime.TryParse(request.DueTo, out dateTime2) == false)
                {
                    dateTime = null;
                }
                else
                    dateTime = dateTime2;

                //}

                var task = new Task
                {
                    Name = request.Name,
                    Description = request.Description,
                    Priority = (Priority)request.Priority,
                    DueTo = dateTime,
                    Status = Status.Planned,
                    ListId = request.ListId
                };
                
				_context.Tasks.Add(task);
				_context.SaveChanges();

				var ret = _context.Tasks
				.Where(t => t.List.UserId == user.Id)
				.Include(t => t.List)
				.Select(t => new
				{
					ListId = t.List.Id,
					ListName = t.List.Name,
					ListColor = t.List.Color,
					ListIcon = t.List.Icon,
					t.Id,
					t.Name,
					t.Description,
					t.DueTo,
					t.CreationDate,
					t.Status,
					t.Priority
				})
				.FirstOrDefault(x => x.Id == task.Id);


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

			var tasksWithFlattenedListDetails = _context.Tasks
				.Where(t => t.DueTo.Value.Date == requestDate.Date && t.List.UserId == user.Id)
				.Include(t => t.List)
				.Select(t => new
				{
					ListId = t.List.Id,
					ListName = t.List.Name,
					ListColor = t.List.Color,
					ListIcon = t.List.Icon,
					t.Id,
					t.Name,
					t.Description,
					t.DueTo,
					t.CreationDate,
					t.Status,
					t.Priority
				})
				.ToList();



			return Ok(tasksWithFlattenedListDetails);  
        }



		[HttpPost("getMonthTaskCounts")]
		public IActionResult GetMonthTaskCounts([FromBody] MonthTaskRequest request)
		{
			var token = Request.Headers[HeaderNames.Authorization].FirstOrDefault()?.Split(" ").Last();
			var handler = new JwtSecurityTokenHandler();
			var decodedToken = handler.ReadJwtToken(token);
			var email = decodedToken.Claims.First(claim => claim.Type == "email").Value;

			var userListIds = _context.Users
				.Where(u => u.Email == email)
				.SelectMany(u => u.Lists.Select(l => l.Id))
				.ToList();

			string[] date = request.Date.Split("-");
			var firstDayOfMonth = new DateTime(int.Parse(date[0]), int.Parse(date[1]), 1);
			var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

			var tasksInMonth = _context.Tasks
				.Where(t => userListIds.Contains((int)t.ListId))
				.Where(t => t.DueTo >= firstDayOfMonth && t.DueTo <= lastDayOfMonth)
				.GroupBy(t => t.DueTo.Value.Day)
				.ToDictionary(
					g => g.Key,
					g => g.Count()
				);

			return Ok(tasksInMonth);
		}

		[HttpPost("editTask")]
		public IActionResult EditTask([FromBody] Task request)
		{
			if (request.Name.IsNullOrEmpty() || request.Description.IsNullOrEmpty())
			{
				return BadRequest();
			}
			var token = Request.Headers[HeaderNames.Authorization].FirstOrDefault()?.Split(" ").Last();
			var handler = new JwtSecurityTokenHandler();
			var decodedToken = handler.ReadJwtToken(token);
			var email = decodedToken.Claims.First(claim => claim.Type == "email").Value;

			var user = _context.Users
				.Where(user => user.Email == email)
				.Include(user => user.Lists)
				.FirstOrDefault();

			var task = _context.Tasks.FirstOrDefault(x => x.Id == request.Id);
			
			if(task.Status != Status.Finished)
			{
				if (request.DueTo > DateTime.Now || request.DueTo == null)
					task.Status = Status.Planned;
				if (request.DueTo < DateTime.Now)
					task.Status = Status.During;
			}


			task.Name = request.Name;
			task.Description = request.Description;
			task.DueTo = request.DueTo;
			task.Priority = request.Priority;

			_context.Tasks.Update(task);
			_context.SaveChanges();


			var taskWithFlattenedListDetails = _context.Tasks
			.Where(t => t.List.UserId == user.Id)
			.Include(t => t.List)
			.Select(t => new
			{
				ListId = t.List.Id,
				ListName = t.List.Name,
				ListColor = t.List.Color,
				ListIcon = t.List.Icon,
				t.Id,
				t.Name,
				t.Description,
				t.DueTo,
				t.CreationDate,
				t.Status,
				t.Priority
			})
			.FirstOrDefault(x => x.Id == request.Id);

			return Ok(taskWithFlattenedListDetails);
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
                var statusBefore = task.Status;  // Zapisz poprzedni status, aby dostarczyć informacje w powiadomieniu
                string notificationTitle = "";
                string notificationContent = "";

                switch (task.Status)
                {
                    case Status.Finished:
						if(task.DueTo < DateTime.Now)
                            task.Status = Status.During;
                        else
							task.Status = Status.Planned;
                        notificationTitle = "Zadanie zostało ponownie zaplanowane";
                        notificationContent = $"Zadanie {task.Name} zostało przeniesione z powrotem do stanu 'Planned'.";
                        break;

                    case Status.Planned:
                    case Status.During:
                        task.Status = Status.Finished;
                        notificationTitle = "Zadanie zostało zakończone";
                        notificationContent = $"Zadanie {task.Name} zostało oznaczone jako 'Finished'.";
                        break;

                    default:
                        return BadRequest("Nieznany status zadania.");
                }

                _context.SaveChanges();

                var token = Request.Headers[HeaderNames.Authorization].FirstOrDefault()?.Split(" ").Last();
                var handler = new JwtSecurityTokenHandler();
                var decodedToken = handler.ReadJwtToken(token);
                var email = decodedToken.Claims.First(claim => claim.Type == "email").Value;

                var user = _context.Users
                    .Where(u => u.Email == email)
                    .FirstOrDefault();

                if (user != null)
                {
                    var notification = new Notification
                    {
                        Title = notificationTitle,
                        Content = notificationContent,
                        SendDate = DateTime.Now,
                        UserId = user.Id
                    };

                    _context.Notifications.Add(notification);
                    _context.SaveChanges();
                }
				var taskSelect = _context.Tasks
					.Where(t => t.Id == taskId)
					.Include(t => t.List)
					.Select(t => new
					{
						ListId = t.List.Id,
						ListName = t.List.Name,
						ListColor = t.List.Color,
						ListIcon = t.List.Icon,
						t.Id,
						t.Name,
						t.Description,
						t.DueTo,
						t.CreationDate,
						t.Status,
						t.Priority
					})
					.First();
				return Ok(taskSelect);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Błąd podczas przełączania statusu zadania: " + ex.Message);
                return StatusCode(500, "Wystąpił błąd podczas aktualizacji zadania.");
            }
        }
    }
}
