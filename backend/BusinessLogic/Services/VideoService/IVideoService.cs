using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using DataAccess.Models;

namespace BusinessLogic.Services.VideoService
{
    public interface IVideoService
    {
        Task UploadChunk(Stream requestBody, Guid userId, string chunkNumber, string fileName);
        Task<Video> CompleteUpload(Guid userId, string fileName);
        Task DeleteVideo(Video video, Guid userId);
        void CreateUserVideoDirectory(Guid userId);
        void DeleteAllChunks(string fileName);
        Task<byte[]> GetVideoThumbnail(Guid userId, Guid videoId);
        Task<MemoryStream> GetVideosZipFileStream(List<Video> videos);
        Task<long> GetUserVideosSize(Guid userId);
        Task MarkVideoForDeletion(Video video);
        Task RestoreVideo(Video video);
        Task DeleteVideosAutomation();
    }
}