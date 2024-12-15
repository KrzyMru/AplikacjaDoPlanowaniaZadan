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
