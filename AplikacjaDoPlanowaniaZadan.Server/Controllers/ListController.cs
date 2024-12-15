using Microsoft.AspNetCore.Mvc;
using AplikacjaDoPlanowaniaZadan.Server.DataModels;
using AplikacjaDoPlanowaniaZadan.Server.DAL.EF;
using Microsoft.EntityFrameworkCore;
using Task = AplikacjaDoPlanowaniaZadan.Server.DataModels.Task;
using System.Collections.Generic;
using System.Security.Claims;
using System.Net;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Net.Http.Headers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using AplikacjaDoPlanowaniaZadan.Server.DataTransfer.Requests;

namespace AplikacjaDoPlanowaniaZadan.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ListController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ListController(ApplicationDbContext context)
        {
            _context = context;
        }

		//[Authorize]
		[HttpPost("saveList")]
        public IActionResult saveList([FromBody] CreateListRequest request)
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

            if (request == null || string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest("Invalid list data.");
            }

            var newList = new List
            {
                Name = request.Name,
                Description = request.Description,
                Color = request.Color,
                Icon = request.Icon,
                Tasks = new List<Task>()
            };

            user.Lists.Add(newList);
            newList.User = user;
            newList.UserId = user.Id;

            _context.Lists.Add(newList);
            _context.Users.Update(user);
            _context.SaveChanges();

            return Ok(new List(newList));
        }

		//[Authorize]
		[HttpPost("getTaskList")]
        public IActionResult getTaskList([FromBody] int listId)
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

            var list = _context.Lists
                .Include(l => l.Tasks)
                .Where(l => l.Id == listId && l.UserId == user.Id)
                .Select(l => new
                {
                    l.Id,
                    l.Name,
                    l.Description,
                    l.Color,
                    l.Icon,
                    Tasks = l.Tasks.Select(t => new
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
					}).ToList()
                })
                .FirstOrDefault();

            if (list == null)
            {
                return NotFound();
            }

            return Ok(list);
        }


		//[Authorize]
		[HttpGet("getTaskListHeaders")]
        public IActionResult getTaskListHeaders()
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

			var listHeaders = _context.Lists
                .Where(x=>x.UserId == user.Id)
                .Select(l => new
                {
                    l.Id,
                    l.Name,
                    l.Color,
                    l.Icon
                })
                .ToList();

            return Ok(listHeaders);
        }

		//[Authorize]
		[HttpPost("editList")]
        public IActionResult EditList([FromBody] List updatedList)
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

			if (updatedList == null || updatedList.Id <= 0)
            {
                return BadRequest("List data is invalid.");
            }

            var existingList = _context.Lists
                .Where(user=> user.Id == updatedList.Id)
                .FirstOrDefault(l => l.Id == updatedList.Id);

            if (existingList == null)
            {
                return NotFound("List not found.");
            }

            existingList.Name = updatedList.Name;
            existingList.Description = updatedList.Description;
            existingList.Color = updatedList.Color;
            existingList.Icon = updatedList.Icon;

            _context.Update(existingList);
            _context.SaveChanges();

            var ret = _context.Lists.Where(x=>x.Id == existingList.Id).Select(l => new
			{
				l.Id,
				l.Name,
				l.Description,
				l.Color,
				l.Icon,
				Tasks = l.Tasks.Select(t => new
				{
					t.Id,
					t.Name,
					t.Description,
					t.DueTo,
					t.Priority,
					t.Status,
					t.CreationDate
				}).ToList()
			}).FirstOrDefault();


			return Ok(ret);
        }

		//[Authorize]
		[HttpDelete("deleteList")]
        public IActionResult deleteList([FromBody] int id)
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

			var list = _context.Lists.Where(x=>x.UserId==user.Id).FirstOrDefault(l => l.Id == id);

            if (list == null)
            {
                return NotFound("List not found.");
            }

            _context.Lists.Remove(list);
            _context.SaveChanges();

            return Ok(new { success = true, message = "List deleted successfully." });
        }


    }
}
