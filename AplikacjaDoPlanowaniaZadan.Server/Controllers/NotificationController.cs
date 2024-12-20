﻿using Microsoft.AspNetCore.Mvc;

using AplikacjaDoPlanowaniaZadan.Server.DataModels;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Net.Http.Headers;
using Microsoft.EntityFrameworkCore;
using System;
using AplikacjaDoPlanowaniaZadan.Server.DAL.EF;
using Microsoft.AspNetCore.Authorization;

namespace AplikacjaDoPlanowaniaZadan.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NotificationController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("getNotifications")]
        public IActionResult GetNotifications()
        {
            var token = Request.Headers[HeaderNames.Authorization].FirstOrDefault()?.Split(" ").Last();
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("Token is missing.");
            }

            var handler = new JwtSecurityTokenHandler();
            var decodedToken = handler.ReadJwtToken(token);
            var email = decodedToken.Claims.FirstOrDefault(claim => claim.Type == "email")?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized("Invalid token.");
            }

            var user = _context.Users
                .Where(u => u.Email == email)
                .Include(u => u.Notifications)
                .FirstOrDefault();

            if (user == null)
            {
                return BadRequest("User not found.");
            }

            var notifications = user.Notifications
                .OrderByDescending(n => n.SendDate)
                .ToList();

            return Ok(notifications);
        }
    }
}
