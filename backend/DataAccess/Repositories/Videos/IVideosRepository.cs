using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DataAccess.Models;

namespace DataAccess.Repositories.Videos
{
    public interface IVideosRepository
    {
        Task<Video> GetVideoById(Guid videoId);
        Task<IEnumerable<Video>> GetAllVideos();
        Task<IEnumerable<Video>> GetAllVideosByUserId(Guid userId);
        Task<IEnumerable<Video>> GetVideosByUserId(Guid userId);
        Task<IEnumerable<Video>> GetDeletedVideosOlderThanDays(int days);
        Task<IEnumerable<Video>> GetDeletedVideosByUserId(Guid userId);
        Task InsertVideo(Video video);
        void RemoveVideo(Video video);
        Task Save();
    }
}