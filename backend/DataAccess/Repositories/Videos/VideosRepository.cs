using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace DataAccess.Repositories.Videos
{
    public class VideosRepository : IVideosRepository
    {
        private readonly BackendContext _db;

        public VideosRepository(BackendContext db)
        {
            _db = db;
        }

        public async Task<Video> GetVideoById(Guid videoId)
        {
            var video = await _db.Videos.FindAsync(videoId);

            return video;
        }

        public async Task<IEnumerable<Video>> GetAllVideos()
        {
            var videos = await _db.Videos.ToListAsync();

            return videos;
        }

        public async Task<IEnumerable<Video>> GetAllVideosByUserId(Guid userId)
        {
            var videos = await _db.Videos.Where(video => video.UserId == userId).ToListAsync();
            return videos;
        }

        public async Task<IEnumerable<Video>> GetVideosByUserId(Guid userId)
        {
            var videos = await _db.Videos.Where(video => video.UserId == userId && video.DeleteDate == null).ToListAsync();
            return videos;
        }

        public async Task<IEnumerable<Video>> GetDeletedVideosByUserId(Guid userId)
        {
            var videos = await _db.Videos.Where(video => video.UserId == userId && video.DeleteDate != null).ToListAsync();
            return videos;
        }

        public async Task<IEnumerable<Video>> GetDeletedVideosOlderThanDays(int days)
        {
            var videos = await _db.Videos.Where(video => video.DeleteDate != null 
                && video.DeleteDate.Value.AddDays(days) <= DateTime.Now).ToListAsync();
            return videos;
        }

        public async Task InsertVideo(Video video)
        {
            await _db.Videos.AddAsync(video);
        }

        public void RemoveVideo(Video video)
        {
            _db.Videos.Remove(video);
        }

        public async Task Save()
        {
            await _db.SaveChangesAsync();
        }
    }
}