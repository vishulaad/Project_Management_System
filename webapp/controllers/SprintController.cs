using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapp.Data;
using webapp.Models;
using webapp.DTOs.Sprints;
using webapp.Services;
using TaskStatus = webapp.Models.TaskStatus;

namespace webapp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SprintController : ControllerBase
    {
        private readonly ISprintService _sprintService;

        public SprintController(ISprintService sprintService)
        {
            _sprintService = sprintService;
        }

        // POST: api/sprint
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<SprintReadDTO>> CreateSprint(SprintCreateDTO dto)
        {
            try
            {
                var sprint = await _sprintService.CreateSprintAsync(dto);
                return CreatedAtAction(nameof(GetSprintById), new { id = sprint.SprintId }, sprint);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        // GET: api/sprint/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<SprintReadDTO>> GetSprintById(int id)
        {
            try
            {
                var sprint = await _sprintService.GetSprintByIdAsync(id);
                if (sprint == null) return NotFound(new { message = "Sprint not found" });
                return Ok(sprint);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        // GET: api/sprint/project/{projectId}
        [HttpGet("project/{projectId}")]
        [Authorize]
        public async Task<ActionResult<List<SprintReadDTO>>> GetSprintsByProject(int projectId)
        {
            try
            {
                var sprints = await _sprintService.GetSprintsByProjectAsync(projectId);
                return Ok(sprints);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        // GET: api/sprint/company/{companyId}
        [HttpGet("company/{companyId}")]
        [Authorize]
        public async Task<ActionResult<List<SprintReadDTO>>> GetSprintsByCompany(int companyId)
        {
            try
            {
                var sprints = await _sprintService.GetSprintsByCompanyAsync(companyId);
                return Ok(sprints);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        // GET: api/sprint/user/{userId}
        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<ActionResult<List<SprintReadDTO>>> GetSprintsByUser(int userId)
        {
            try
            {
                var sprints = await _sprintService.GetSprintsByUserAsync(userId);
                return Ok(sprints);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        // PUT: api/sprint/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateSprint(int id, SprintUpdateDTO dto)
        {
            try
            {
                var updated = await _sprintService.UpdateSprintAsync(id, dto);
                if (updated == null) return NotFound(new { message = "Sprint not found" });
                return Ok(updated);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        // DELETE: api/sprint/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteSprint(int id)
        {
            try
            {
                var result = await _sprintService.DeleteSprintAsync(id);
                if (!result) return NotFound(new { message = "Sprint not found" });
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpGet("generate-name/{projectId}")]
     [Authorize]
public async Task<ActionResult<object>> GenerateSprintName(int projectId)
{
    try
    {
        var sprintName = await _sprintService.GenerateSprintNameAsync(projectId);
        return Ok(new { name = sprintName });
    }
    catch (ArgumentException ex)
    {
        return BadRequest(new { message = ex.Message });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "Internal server error", details = ex.Message });
    }
}
    }
}