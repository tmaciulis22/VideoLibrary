using System;
using System.Threading.Tasks;
using DataAccess.Models;

namespace DataAccess.Repositories.Users
{
    public interface IUsersRepository
    {
        Task<User> GetUserById(Guid userId);
        Task<User> GetUserByEmail(string email);
        Task<User> GetUserByEmailAndPassword(string email, string password);
        Task InsertUser(User user);
        Task Save();
    }
}