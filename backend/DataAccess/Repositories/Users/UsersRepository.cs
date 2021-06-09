using System;
using System.Threading.Tasks;
using DataAccess.Models;
using DataAccess.Utils;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories.Users
{
    public class UsersRepository : IUsersRepository
    {
        private readonly BackendContext _db;

        public UsersRepository(BackendContext db)
        {
            _db = db;
        }

        public async Task<User> GetUserById(Guid userId)
        {
            var user = await _db.Users.FindAsync(userId);

            return user;
        }

        public async Task<User> GetUserByEmail(string email)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);

            return user;
        }

        public async Task<User> GetUserByEmailAndPassword(string email, string password)
        {
            var user = await GetUserByEmail(email);

            if (user is null)
            {
                return null;
            }

            if (!Hasher.CheckPlaintextAgainstHash(password, user.Password, user.Salt))
            {
                return null;
            }

            return user;
        }

        public async Task InsertUser(User user)
        { 
            await _db.Users.AddAsync(user);
        }

        public async Task Save()
        {
            await _db.SaveChangesAsync();
        }
    }
}