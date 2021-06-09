using BusinessLogic.Configuration.Email;
using MailKit.Net.Smtp;
using MimeKit;

namespace BusinessLogic.Services.EmailService
{
    public class EmailService : IEmailService
    {
        private readonly IEmailConfiguration _emailConfiguration;

        public EmailService(IEmailConfiguration emailConfiguration)
        {
            _emailConfiguration = emailConfiguration;
        }

        public void SendVerificationEmail(string receiverName, string receiverEmail, string verificationLink)
        {
            var mailMessage = new MimeMessage();

            mailMessage.From.Add(new MailboxAddress(
                _emailConfiguration.BusinessEmailName, 
                _emailConfiguration.BusinessEmailAddress));

            mailMessage.To.Add(new MailboxAddress(receiverName, receiverEmail));
            mailMessage.Subject = "Account verification";
            mailMessage.Body = new TextPart("html")
            {
                Text = $"<a href=\"{verificationLink}\">Click here to verify your account!</a>"
            };

            using (var smtpClient = new SmtpClient())
            {
                smtpClient.Connect(
                    _emailConfiguration.SmtpClientConfiguration.Host,
                    _emailConfiguration.SmtpClientConfiguration.Port,
                    _emailConfiguration.SmtpClientConfiguration.UseSsl);

                smtpClient.Authenticate(
                    _emailConfiguration.BusinessEmailAddress, 
                    _emailConfiguration.BusinessEmailPassword);

                smtpClient.Send(mailMessage);
                smtpClient.Disconnect(true);
            }
        }

        public void SendForgotPasswordEmail(string receiverName, string receiverEmail, string resetPasswordLink)
        {
            var mailMessage = new MimeMessage();

            mailMessage.From.Add(new MailboxAddress(
                _emailConfiguration.BusinessEmailName,
                _emailConfiguration.BusinessEmailAddress));

            mailMessage.To.Add(new MailboxAddress(receiverName, receiverEmail));
            mailMessage.Subject = "Reset password";
            mailMessage.Body = new TextPart("html")
            {
                Text = $"<a href=\"{resetPasswordLink}\">Click here to reset your password!</a>"
            };

            using (var smtpClient = new SmtpClient())
            {
                smtpClient.Connect(
                    _emailConfiguration.SmtpClientConfiguration.Host, 
                    _emailConfiguration.SmtpClientConfiguration.Port, 
                    _emailConfiguration.SmtpClientConfiguration.UseSsl);

                smtpClient.Authenticate(
                    _emailConfiguration.BusinessEmailAddress,
                    _emailConfiguration.BusinessEmailPassword);

                smtpClient.Send(mailMessage);
                smtpClient.Disconnect(true);
            }
        }
    }
}