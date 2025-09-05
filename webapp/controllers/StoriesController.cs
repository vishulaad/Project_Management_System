// Controllers/StoriesController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using webapp.DTOs.Stories;
using webapp.Services;

namespace webapp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoriesController : ControllerBase
    {
        private readonly IStoryService _storyService;

        public StoriesController(IStoryService storyService)
        {
            _storyService = storyService;
        }

        // POST: api/stories
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<StoryReadDTO>> CreateStory(StoryCreateDTO dto)
        {
            try
            {
                var story = await _storyService.CreateStoryAsync(dto);
                return CreatedAtAction(nameof(GetStoryById), new { id = story.StoryId }, story);
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

        // GET: api/stories/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<StoryReadDTO>> GetStoryById(int id)
        {
            try
            {
                var story = await _storyService.GetStoryByIdAsync(id);
                if (story == null) return NotFound(new { message = "Story not found" });
                return Ok(story);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        // GET: api/stories/sprint/{sprintId}
        [HttpGet("sprint/{sprintId}")]
        [Authorize]
        public async Task<ActionResult<List<StoryReadDTO>>> GetStoriesBySprint(int sprintId)
        {
            try
            {
                var stories = await _storyService.GetStoriesBySprintAsync(sprintId);
                return Ok(stories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        // GET: api/stories/project/{projectId}
        [HttpGet("project/{projectId}")]
        [Authorize]
        public async Task<ActionResult<List<StoryReadDTO>>> GetStoriesByProject(int projectId)
        {
            try
            {
                var stories = await _storyService.GetStoriesByProjectAsync(projectId);
                return Ok(stories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        // PUT: api/stories/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateStory(int id, StoryUpdateDTO dto)
        {
            try
            {
                var updated = await _storyService.UpdateStoryAsync(id, dto);
                if (updated == null) return NotFound(new { message = "Story not found" });
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

        // DELETE: api/stories/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteStory(int id)
        {
            try
            {
                var result = await _storyService.DeleteStoryAsync(id);
                if (!result) return NotFound(new { message = "Story not found" });
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }
    }
}