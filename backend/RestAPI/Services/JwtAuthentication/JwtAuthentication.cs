using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Repositories.Users;
using Microsoft.IdentityModel.Tokens;

namespace RestAPI.Services.JwtAuthentication
{
    public class JwtAuthentication : IJwtAuthentication
    {
        private readonly IUsersRepository _usersRepository;
        private readonly string _tokenKey;

        public JwtAuthentication(
            string tokenKey, 
            IUsersRepository usersRepository)
        {
            _tokenKey = tokenKey;
            _usersRepository = usersRepository;
        }

        public async Task<string> Authenticate(string email, string password)
        {
            var user = await _usersRepository.GetUserByEmailAndPassword(email, password);
            if (user is null || !user.Confirmed)
            {
                return null;
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_tokenKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<string> CreateResetPasswordToken(string email)
        {
            var user = await _usersRepository.GetUserByEmail(email);
            if (user == null)
            {
                return null;
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_tokenKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("ResetPassword", "True"),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(10),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        
        public string ManualValidation(string token) {
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_tokenKey));
            var validator = new JwtSecurityTokenHandler();
            
            if (!validator.CanReadToken(token)) return null;
        
            // Parameters copied straight outta ServiceCollectionExtensions.cs
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateIssuer = false,
                ValidateAudience = false
            };
            
            try
            {
                // This line throws if invalid
                var principal = validator.ValidateToken(token, validationParameters, out _);

                if (principal.HasClaim(c => c.Type == ClaimTypes.NameIdentifier))
                {
                    return principal.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value;
                }
            }
            catch (Exception)
            {
                return null;
            }

            return null;
        }
    }
}
