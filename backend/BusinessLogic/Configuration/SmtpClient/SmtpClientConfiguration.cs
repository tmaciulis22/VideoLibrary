namespace BusinessLogic.Configuration.SmtpClient
{
    public class SmtpClientConfiguration
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public bool UseSsl { get; set; }
    }
}