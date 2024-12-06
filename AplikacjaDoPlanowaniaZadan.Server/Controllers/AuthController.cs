using AplikacjaDoPlanowaniaZadan.Server.DAL.EF;
using AplikacjaDoPlanowaniaZadan.Server.DataModels;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Collections;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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
            var user = _context.Users.FirstOrDefault(user => user.Email == loginRequest.Email);
            if (user != null)
            {
                return BadRequest();
            }

            var newUser = new User
            {
                Email = loginRequest.Email,
                Password = loginRequest.Password,
            };
            _context.Users.Add(newUser);
            _context.SaveChanges();

            return Ok();
        }
    }
}
