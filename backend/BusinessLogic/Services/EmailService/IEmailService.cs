namespace BusinessLogic.Services.EmailService
{
    public interface IEmailService
    {
        void SendVerificationEmail(string receiverName, string receiverEmail, string verificationLink);
        void SendForgotPasswordEmail(string receiverName, string receiverEmail, string resetPasswordLink);
    }
}