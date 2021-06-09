using System.ComponentModel.DataAnnotations;

namespace RestAPI.Models.Requests
{
    public class ChangeCredentialsRequest
    {
        [EmailAddress]
        public string Email { get; set; }
        
        [RegularExpression(@"^(?=.*\d)(?=.*[A-Z])(?!.*[^a-zA-Z0-9@#$^+=])(.{8,})$")]
        public string OldPassword { get; set; }
        
        [RegularExpression(@"^(?=.*\d)(?=.*[A-Z])(?!.*[^a-zA-Z0-9@#$^+=])(.{8,})$")]
        public string NewPassword { get; set; }
    }
}
