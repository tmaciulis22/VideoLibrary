using System;

namespace RestAPI.Models.Responses
{
    public class VideoDto
    {
        public Guid Id { get; set; }
        public long Size { get; set; }
        public string Title { get; set; }
        public string UploadDate { get; set; }
        public string RowVersion { get; set; }
    }
}
