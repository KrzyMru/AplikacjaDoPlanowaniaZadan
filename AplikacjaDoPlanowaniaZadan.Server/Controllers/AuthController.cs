using AplikacjaDoPlanowaniaZadan.Server.DAL.EF;
using AplikacjaDoPlanowaniaZadan.Server.DataModels;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Collections;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace AplikacjaDoPlanowaniaZadan.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IConfiguration _config;
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context, IConfiguration config)
        {
            _config = config;
            _context = context;
        }

        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        private (bool IsValid, string ErrorMessage) ValidateCredentials(string email, string password)
        {
            if (string.IsNullOrEmpty(email) || !Regex.IsMatch(email, @"^\S+@\S+\.\S+$"))
            {
                return (false, "Invalid email address.");
            }

            if (string.IsNullOrEmpty(password))
            {
                return (false, "Password is required.");
            }
            if (password.Length < 8)
            {
                return (false, "Password must be at least 8 characters long.");
            }
            if (!char.IsUpper(password[0]))
            {
                return (false, "Password must start with a capital letter.");
            }
            if (!Regex.IsMatch(password, @"\W"))
            {
                return (false, "Password must contain at least one non-alphanumeric character.");
            }
            if (!Regex.IsMatch(password, @"\d"))
            {
                return (false, "Password must contain at least one digit.");
            }

            return (true, string.Empty);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            var user = _context.Users.FirstOrDefault(user => user.Email == loginRequest.Email);
            if (user == null || user.Password != loginRequest.Password) {
                return BadRequest();
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim>();
            claims.Add(new Claim("email", loginRequest.Email));

            var Sectoken = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Issuer"],
                claims,
                expires: DateTime.Now.AddHours(24),
                signingCredentials: credentials
            );

            var token = new JwtSecurityTokenHandler().WriteToken(Sectoken);

            return Ok(Content(token, "application/json"));
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] LoginRequest loginRequest)
        {
            var validation = ValidateCredentials(loginRequest.Email, loginRequest.Password);
            if (!validation.IsValid)
            {
                return BadRequest(new { message = validation.ErrorMessage });
            }

            if (_context.Users.Any(u => u.Email == loginRequest.Email))
            {
                return Conflict(new { message = "Email already in use." });
            }

            var newUser = new User
            {
                Email = loginRequest.Email,
                Password = loginRequest.Password 
            };

            _context.Users.Add(newUser);
            _context.SaveChanges();

            return Ok();
        }
    }
}
