using Microsoft.AspNetCore.Mvc;
using AplikacjaDoPlanowaniaZadan.Server.DataModels;
using AplikacjaDoPlanowaniaZadan.Server.DAL.EF;
using Microsoft.EntityFrameworkCore;

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
        public IActionResult saveList([FromBody] List list)
        {
            if (list == null)
            {
                return BadRequest("List data is invalid.");
            }

           
            _context.Database.ExecuteSqlRaw("INSERT INTO Lists (Name, Description, Color) VALUES ({0}, {1}, {2})", list.Name, list.Description, list.Color);
            return CreatedAtAction(nameof(getTaskList), new { id = list.Id }, list);
        }


        [HttpGet("getTaskList")]
        public IActionResult getTaskList([FromQuery] int listId)
        {
            // Użyj LINQ do przefiltrowania listy według Id
            var list = _context.Lists.FirstOrDefault(l => l.Id == listId);


            if (list == null)
            {
                Console.WriteLine("HAHA - Nie znaleziono listy o podanym Id.");
                return NotFound(); // Możesz zwrócić 404, jeśli lista nie istnieje
            }

            return Ok(list); // Zwróć 200 z danymi
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
    }
}
