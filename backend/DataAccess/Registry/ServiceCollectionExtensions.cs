using System.Linq;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DataAccess.Registry
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddDataAccess(this IServiceCollection services, IConfiguration configuration)
        {
            return services.AddDbContext<BackendContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString(nameof(BackendContext)), b => b.MigrationsAssembly("RestAPI")));
        }

        public static void AddRepositories(this IServiceCollection services, string assemblyName)
        {
            var assembly = Assembly.GetExecutingAssembly();
            var types = assembly.GetTypes().Where(p => p.Name.EndsWith("Repository")).ToArray();

            var addScopedMethod = typeof(ServiceCollectionServiceExtensions).GetMethods().FirstOrDefault(m =>
                m.Name == "AddScoped" &&
                m.IsGenericMethod &&
                m.GetGenericArguments().Count() == 2);

            foreach (var type in types)
            {
                if (type.IsInterface)
                    continue;

                var implementedInterface = type.GetInterfaces().FirstOrDefault(x => x.Name.Contains(type.Name));
                var method = addScopedMethod.MakeGenericMethod(new[] { implementedInterface, type });
                method.Invoke(services, new[] { services });
            }
        }
    }
}