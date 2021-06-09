using BusinessLogic.Configuration.SmtpClient;

namespace BusinessLogic.Configuration.Email
{
    public interface IEmailConfiguration
    {
        public string BusinessEmailAddress { get; set; }
        public string BusinessEmailPassword { get; set; }
        public string BusinessEmailName { get; set; }
        public SmtpClientConfiguration SmtpClientConfiguration { get; set; }
    }
}