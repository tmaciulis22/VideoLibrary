using System;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Models
{
    public class Video
    {
        public Video()
        {
            UploadDate = DateTime.UtcNow;
            DeleteDate = null;
        }
        public Guid Id { get; set; }

        [Required]
        public string Title { get; set; }
        [Required]
        public long Size { get; set; }
        [Required]
        public int Width { get; set; }
        [Required]
        public int Height { get; set; }
        [Required]
        public int Duration { get; set; }
        [Required]
        public string Format { get; set; }
        [Required]
        public string Path { get; set; }

        [Required]
        public DateTime UploadDate { get; set; }
        public DateTime? DeleteDate { get; set; }

        [Required]
        public Guid UserId { get; set; }
        public User User { get; set; }

        [Timestamp] public byte[] RowVersion { get; set; }
    }
}
