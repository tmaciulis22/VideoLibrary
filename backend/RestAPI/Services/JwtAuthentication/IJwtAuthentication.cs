using System.Threading.Tasks;

namespace RestAPI.Services.JwtAuthentication
{
    public interface IJwtAuthentication
    {
        Task<string> Authenticate(string email, string password);
        Task<string> CreateResetPasswordToken(string email);
        string ManualValidation(string token);
    }
}
