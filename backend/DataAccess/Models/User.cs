using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using DataAccess.Utils;

namespace DataAccess.Models
{
    public class User
    {
        // This is needed so that when EF retrieves a User entity from the DB it could return it as-is
        // (without changing the password f.e.)
        private User() {}

        public User(string password)
        {
            Confirmed = false;
            (Salt, Password) = Hasher.HashPassword(password);
        }
        public Guid Id { get; set; }

        [Required]
        public string Firstname { get; set; }

        [Required]
        public string Lastname { get; set; }

        [Required]
        public string Email { get; set; }

        [Required] public string Password { get; private set; }

        [Required]
        public byte[] Salt { get; private set; }

        [Required]
        public bool Confirmed { get; set; }
        public List<Video> Videos { get; set; }

        // Password change entrypoint
        public void SetNewPassword(string password)
        {
            (Salt, Password) = Hasher.HashPassword(password);
        }
    }
}
