using BusinessLogic.Services.EmailService;
using BusinessLogic.Services.VideoService;
using Hangfire;
using Hangfire.MemoryStorage;
using Microsoft.Extensions.DependencyInjection;

namespace BusinessLogic.Registry
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddBusinessLogicServices(this IServiceCollection services)
        {
            return services
                    .AddScoped<IEmailService, EmailService>()
                    .AddScoped<IVideoService, VideoService>()
                    .AddHangfireServer()
                    .AddHangfire(config =>
                    config.SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
                    .UseSimpleAssemblyNameTypeSerializer()
                    .UseDefaultTypeSerializer()
                    .UseMemoryStorage());
        }
    }
}