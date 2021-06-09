using System.Collections.Generic;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.EntityConfigurations
{
    public class VideoEntityConfiguration : IEntityTypeConfiguration<Video>
    {
        private List<Video> Videos;
        public VideoEntityConfiguration(List<Video> videos)
        {
            Videos = videos;
        }
        public void Configure(EntityTypeBuilder<Video> builder)
        {
            builder.HasKey(c => c.Id);
            builder.Property(c => c.Title).HasMaxLength(250);
            builder.Property(c => c.Size);
            builder.Property(c => c.Width);
            builder.Property(c => c.Height);
            builder.Property(c => c.Duration);
            builder.Property(c => c.Format);
            builder.Property(c => c.UploadDate);
            builder.Property(c => c.DeleteDate);
            builder.Property(c => c.RowVersion);

            builder.HasOne(c => c.User)
                .WithMany(c => c.Videos)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
