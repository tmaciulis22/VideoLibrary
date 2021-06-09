using System.Collections.Generic;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.EntityConfigurations
{
    public class UserEntityConfiguration : IEntityTypeConfiguration<User>
    {
        private List<User> Users;
        public UserEntityConfiguration(List<User> users)
        {
            Users = users;
        }
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(c => c.Id);
            builder.Property(c => c.Firstname).HasMaxLength(250);
            builder.Property(c => c.Lastname).HasMaxLength(250);
            builder.Property(c => c.Email).HasMaxLength(250);
            builder.Property(c => c.Password).HasMaxLength(250);
            builder.Property(c => c.Salt).HasMaxLength(250);
            builder.Property(c => c.Confirmed);

            builder.HasMany(c => c.Videos)
                .WithOne(c => c.User)
                .HasForeignKey(c => c.UserId);
        }
    }
}
