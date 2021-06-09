using System;
using System.Security.Claims;
using System.Threading.Tasks;
using BusinessLogic.Services.EmailService;
using BusinessLogic.Services.VideoService;
using DataAccess.Models;
using DataAccess.Repositories.Users;
using DataAccess.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestAPI.Models.Requests;
using RestAPI.Models.Responses;
using RestAPI.Services.JwtAuthentication;

namespace RestAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersRepository _usersRepository;
        private readonly IJwtAuthentication _jwtAuthentication;
        private readonly IEmailService _emailService;
        private readonly IVideoService _videoService;

        public UsersController(
            IUsersRepository usersRepository,
            IJwtAuthentication jwtAuthentication,
            IEmailService emailService, 
            IVideoService videoService)
        {
            _usersRepository = usersRepository;
            _jwtAuthentication = jwtAuthentication;
            _emailService = emailService;
            _videoService = videoService;
        }

        [HttpGet, Route("current")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var resetPasswordClaim = User.FindFirst(x => x.Type == "ResetPassword");
            if (resetPasswordClaim is not null && resetPasswordClaim.Value == "True")
            {
                return Unauthorized();
            }

            var userIdClaim = User.FindFirst(x => x.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim is null)
            {
                return NotFound();
            }

            if (!Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return NotFound();
            }

            var user = await _usersRepository.GetUserById(userId);
            if (user is null)
            {
                return NotFound();
            }

            var userDto = new UserDto
            {
                Id = user.Id,
                FirstName = user.Firstname,
                LastName = user.Lastname,
                Email = user.Email
            };

            return userDto;
        }

        [HttpGet, Route("size")]
        public async Task<ActionResult<long>> GetUserVideosSize()
        {
            var userIdClaim = User.FindFirst(x => x.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim is null)
            {
                return NotFound();
            }

            if (!Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return NotFound();
            }

            var user = await _usersRepository.GetUserById(userId);
            if (user is null)
            {
                return NotFound();
            }

            var size = await _videoService.GetUserVideosSize(user.Id);
            return Ok(size);
        }

        [HttpPost, Route("authentication"), AllowAnonymous]
        public async Task<ActionResult<string>> Authenticate(string email, string password)
        {
            if(string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            {
                return BadRequest();
            }

            var token = await _jwtAuthentication.Authenticate(email, password);

            if (token is null)
            {
                return NotFound();
            }

            return Ok(token);
        }

        [HttpPost, Route("register"), AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegistrationRequest registrationRequest)
        {
            if (string.IsNullOrWhiteSpace(registrationRequest.Email) ||
                !RegexValidation.IsEmailValid(registrationRequest.Email))
            {
                return BadRequest();
            }

            if (string.IsNullOrWhiteSpace(registrationRequest.FirstName) || 
                string.IsNullOrWhiteSpace(registrationRequest.LastName) || 
                !RegexValidation.IsNameValid(registrationRequest.FirstName) || 
                !RegexValidation.IsNameValid(registrationRequest.LastName))
            {
                return BadRequest();
            }

            if (string.IsNullOrWhiteSpace(registrationRequest.Password) ||
                !RegexValidation.IsPasswordValid(registrationRequest.Password))
            {
                return BadRequest();
            }

            if (await _usersRepository.GetUserByEmail(registrationRequest.Email) != null)
            {
                return Conflict();
            }

            User user = new User(registrationRequest.Password)
            {
                Firstname = registrationRequest.FirstName,
                Lastname = registrationRequest.LastName,
                Email = registrationRequest.Email
            };

            await _usersRepository.InsertUser(user);

            try
            {
                string endpoint = "http://localhost:3000/verify/" + user.Id;
                _emailService.SendVerificationEmail(user.Firstname, user.Email, endpoint);
                await _usersRepository.Save();
            }
            catch
            {
                return StatusCode(500);
            }

            return Ok();
        }

        [HttpPost, Route("verify"), AllowAnonymous]
        public async Task<IActionResult> Verify(Guid id)
        {
            if (id == Guid.Empty)
            {
                return BadRequest();
            }

            var user = await _usersRepository.GetUserById(id);
            if (user == null)
            {
                return NotFound();
            }

            user.Confirmed = true;
            await _usersRepository.Save();

            return Ok();
        }

        [HttpPost, Route("forgot-password"), AllowAnonymous]
        public async Task<IActionResult> ForgotPassword(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest();
            }

            var user = await _usersRepository.GetUserByEmail(email);
            if (user == null)
            {
                return Ok();
            }

            var token = await _jwtAuthentication.CreateResetPasswordToken(user.Email);
            
            var endpoint = "http://localhost:3000/reset-password/" + token;
            try
            {
                _emailService.SendForgotPasswordEmail(user.Firstname, user.Email, endpoint);
            }
            catch
            {
                return StatusCode(500);
            }

            return Ok();
        }

        [HttpPatch, Route("reset-password")]
        public async Task<IActionResult> ResetPassword(string newPassword)
        {
            var resetPasswordClaim = User.FindFirst(x => x.Type == "ResetPassword");
            if (resetPasswordClaim is null)
            {
                return NotFound();
            }

            if (resetPasswordClaim.Value != "True")
            {
                return Unauthorized();
            }

            var userIdClaim = User.FindFirst(x => x.Type == ClaimTypes.NameIdentifier);
            
            if (userIdClaim is null)
            {
                return NotFound();
            }
            
            if (!Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return NotFound();
            }

            var user = await _usersRepository.GetUserById(userId);
            if (user is null || !user.Confirmed)
            {
                return NotFound();
            }
            
            if (string.IsNullOrWhiteSpace(newPassword) || !RegexValidation.IsPasswordValid(newPassword))
            {
                return BadRequest();
            }

            user.SetNewPassword(newPassword);
            await _usersRepository.Save();

            return Ok();
        } 
        [HttpPatch, Route("{id}")]
        public async Task<IActionResult> UpdateUser([FromBody] ChangeCredentialsRequest request, [FromRoute] Guid id)
        {
            if (string.IsNullOrWhiteSpace(request.Email) && string.IsNullOrWhiteSpace(request.OldPassword)
                                                         && string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest("Request is empty");
            }
            
            var userIdClaim = User.FindFirst(x => x.Type == ClaimTypes.NameIdentifier);

            if (userIdClaim is null)
            {
                return NotFound("JWT doesn't correspond to any user");
            }

            if (!Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return NotFound("JWT token is malformed");
            }

            if (id != userId)
            {
                return BadRequest("User ID and JWT mismatch");
            }

            var user = await _usersRepository.GetUserById(userId);
            if (user is null)
            {
                return NotFound("JWT doesn't correspond to any user");
            }

            if (request.Email != user.Email && await _usersRepository.GetUserByEmail(request.Email) != null)
            {
                return Conflict("User with this email already exists");
            }

            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                user.Email = request.Email;
            }
            
            if ((string.IsNullOrWhiteSpace(request.OldPassword) && !string.IsNullOrWhiteSpace(request.NewPassword)) 
                || !string.IsNullOrWhiteSpace(request.OldPassword) && string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest("Only one password field provided");
            }
            
            if (!string.IsNullOrWhiteSpace(request.OldPassword) && !string.IsNullOrWhiteSpace(request.NewPassword))
            {
                if (request.OldPassword == request.NewPassword)
                {
                    return BadRequest("New password is the same as the old");
                }
                
                if(Hasher.CheckPlaintextAgainstHash(request.OldPassword, user.Password, user.Salt))
                {
                    user.SetNewPassword(request.NewPassword);
                }
                else
                {
                    return BadRequest("Old password is incorrect");
                }
            }
            
            try
            {
                await _usersRepository.Save();
            }
            catch
            {
                return StatusCode(500, "Error while saving user data");
            }

            return NoContent();
        }
    }
}
