﻿using Microsoft.AspNetCore.Mvc;
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
using AplikacjaDoPlanowaniaZadan.Server.DataTransfer.DTO;
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

        [HttpPost("saveList")]
        public IActionResult saveList([FromBody] CreateListRequest request)
        {
            // token, trzeba tego użyć wszędzie
            var token = Request.Headers[HeaderNames.Authorization].FirstOrDefault()?.Split(" ").Last();
            var handler = new JwtSecurityTokenHandler();
            var decodedToken = handler.ReadJwtToken(token);
            var email = decodedToken.Claims.First(claim => claim.Type == "email").Value;

            var user = _context.Users.FirstOrDefault(user => user.Email == email);
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
                Tasks = new List<Task>()
            };
            user.Lists.Add(newList);
            newList.User = user;
            newList.UserId = user.Id.ToString();

            _context.Lists.Add(newList);
            _context.Users.Update(user);
            _context.SaveChanges();

            return Ok(new ListDTO(newList));
        }


        [HttpPost("getTaskList")]
        public IActionResult getTaskList([FromBody] int listId)
        {
            var list = _context.Lists
                .Include(l => l.Tasks)
                .Where(l => l.Id == listId)
                .Select(l => new
                {
                    l.Id,
                    l.Name,
                    l.Description,
                    l.Color,
                    Tasks = l.Tasks.Select(t => new
                    {
                        t.Id,
                        t.Name,
                        t.Description,
                        t.DueTo,
                        t.Priority,
                        t.Status
                    }).ToList()
                })
                .FirstOrDefault();

            if (list == null)
            {
                return NotFound();
            }

            return Ok(list);
        }



        [HttpGet("getTaskListHeaders")]
        public IActionResult getTaskListHeaders()
        {
            var listHeaders = _context.Lists 
                .FromSqlRaw("SELECT Id, Name, Color FROM Lists")
                .Select(l => new
                {
                    l.Id,
                    l.Name,
                    l.Color
                })
                .ToList();

            return Ok(listHeaders);
        }

        [HttpPost("editList")]
        public IActionResult EditList([FromBody] List updatedList)
        {
            if (updatedList == null || updatedList.Id <= 0)
            {
                return BadRequest("List data is invalid.");
            }

            var existingList = _context.Lists
                .Include(l => l.Tasks) 
                .FirstOrDefault(l => l.Id == updatedList.Id);

            if (existingList == null)
            {
                return NotFound("List not found.");
            }

            existingList.Name = updatedList.Name;
            existingList.Description = updatedList.Description;
            existingList.Color = updatedList.Color;

            _context.SaveChanges();

            return Ok(new
            {
                Id = existingList.Id,
                Name = existingList.Name,
                Description = existingList.Description,
                Color = existingList.Color,
                Tasks = existingList.Tasks.Select(t => new
                {
                    t.Id,
                    t.Name,
                    t.Description,
                    t.DueTo,
                    Priority = (int)t.Priority, 
                    Status = (int)t.Status 
                }).ToList()
            });
        }


        [HttpDelete("deleteList")]
        public IActionResult deleteList([FromBody] int id)
        {

            var list = _context.Lists.FirstOrDefault(l => l.Id == id);

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
