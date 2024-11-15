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

            _context.Lists.Add(list);
            _context.SaveChanges();
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

            //var tasks = _context.Tasks.Where(t => t.Id == listId).ToList();

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
        public IActionResult editList([FromBody] List updatedList)
        {
            if (updatedList == null || updatedList.Id <= 0)
            {
                return BadRequest("List data is invalid.");
            }

            var existingList = _context.Lists.FirstOrDefault(l => l.Id == updatedList.Id);

            if (existingList == null)
            {
                return NotFound("List not found.");
            }

            existingList.Name = updatedList.Name;
            existingList.Description = updatedList.Description;
            existingList.Color = updatedList.Color;

            _context.SaveChanges();
            return Ok(existingList);
        }

        [HttpDelete("deleteList")]
        public IActionResult deleteList([FromBody] int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid list ID.");
            }

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
