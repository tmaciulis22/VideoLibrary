using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RestAPI.Models.Responses
{
    public class VideoInformationDto
    {
        public Guid Id { get; set; }
        public long Size { get; set; }
        public string Title { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public int Duration { get; set; }
        public string Format { get; set; }
        public string UploadDate { get; set; }
        public string DeleteDate { get; set; }
        public string RowVersion { get; set; }
    }
}
