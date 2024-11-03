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

           // Tu poprawka, lista zwracana jest zła, głównie jej id.
            _context.Database.ExecuteSqlRaw("INSERT INTO Lists (Name, Description, Color) VALUES ({0}, {1}, {2})", list.Name, list.Description, list.Color);
            return CreatedAtAction(nameof(getTaskList), new { id = list.Id }, list);
        }


        [HttpPost("getTaskList")]
        public IActionResult getTaskList([FromBody] int listId)
        {
            var list = _context.Lists.FirstOrDefault(l => l.Id == listId);

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
    }
}
