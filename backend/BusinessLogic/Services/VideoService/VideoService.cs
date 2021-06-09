using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using DataAccess.Models;
using DataAccess.Repositories.Videos;
using DataAccess.Utils;
using Microsoft.AspNetCore.StaticFiles;
using Xabe.FFmpeg;

namespace BusinessLogic.Services.VideoService
{
    public class VideoService : IVideoService
    {
        private readonly IVideosRepository _videosRepository;
        private readonly string _uploadPath;
        private readonly string _tempPath;
        private readonly int _chunkSize;

        public VideoService(IVideosRepository videosRepository)
        {
            _videosRepository = videosRepository;
            _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            _tempPath = Path.Combine(_uploadPath, "Temp");
            _chunkSize = 28000000; // 28MB
        }

        public async Task UploadChunk(Stream requestBody, Guid userId, string chunkNumber, string fileName)
        {
            CreateUserVideoDirectory(userId); // Creates storage folders for users if needed

            string newPath = Path.Combine(_tempPath, chunkNumber + "_" + Path.GetFileNameWithoutExtension(fileName) + "-" + userId + Path.GetExtension(fileName));
            if (!Directory.Exists(_tempPath))
            {
                Directory.CreateDirectory(_tempPath);
            }

            using (FileStream fs = File.Create(newPath))
            {
                byte[] bytes = new byte[_chunkSize];
                int bytesRead = 0;
                while ((bytesRead = await requestBody.ReadAsync(bytes, 0, bytes.Length)) > 0)
                {
                    fs.Write(bytes, 0, bytesRead);
                }
            }
        }

        public async Task<Video> CompleteUpload(Guid userId, string fileName)
        {
            string userPath = Path.Combine(_uploadPath, userId.ToString());
            string tempFilePath = Path.Combine(_tempPath, fileName);
            string[] filePaths = Directory.GetFiles(_tempPath)
                .Where(p => p.Contains(Path.GetFileNameWithoutExtension(fileName))
                            && p.Contains(userId.ToString()))
                .OrderBy(x => int.Parse(Regex.Match(x, RegexValidation.CHUNK_NUMBER_REGEX).Value))
                .ToArray();

            foreach (string chunk in filePaths)
            {
                MergeChunks(tempFilePath, chunk);
            }

            long size = new FileInfo(tempFilePath).Length;
            var video = new Video
            {
                UserId = userId,
                Title = Path.GetFileNameWithoutExtension(fileName),
                Size = size,
                UploadDate = DateTime.Now,
            };

            video.Id = Guid.NewGuid();

            string finalFilePath = Path.Combine(userPath, video.Id + Path.GetExtension(fileName));
            File.Move(tempFilePath, finalFilePath);
            video.Path = finalFilePath;

            var info = await FFmpeg.GetMediaInfo(finalFilePath);
            video.Duration = (int)info.Duration.TotalSeconds;
            var streamInfo = info.VideoStreams.ToList()[0];
            video.Width = streamInfo.Width;
            video.Height = streamInfo.Height;
            video.Format = Path.GetExtension(finalFilePath).Replace(".", "");

            string snapshotFolderPath = Path.Combine(userPath, "Snapshots");
            string snapshotPath = Path.Combine(snapshotFolderPath, video.Id + ".png");
            IConversion conversion = await FFmpeg.Conversions.FromSnippet.Snapshot(finalFilePath, snapshotPath, TimeSpan.FromSeconds(1));
            await conversion.Start();

            await _videosRepository.InsertVideo(video);
            await _videosRepository.Save();

            return video;
        }

        public async Task DeleteVideo(Video video, Guid userId)
        {
            string snapshotPath = Path.Combine(Path.Combine(_uploadPath, userId.ToString()), Path.Combine("Snapshots", video.Id + ".png"));

            // two try-catch to try deleting both separately
            try
            {
                File.Delete(video.Path);
            }
            catch
            {
                // ignored
            }

            try
            {
                File.Delete(snapshotPath);
            }
            catch
            {
                // ignored
            }

            _videosRepository.RemoveVideo(video);
            await _videosRepository.Save();
        }

        public void CreateUserVideoDirectory(Guid userId)
        {
            string userPath = Path.Combine(_uploadPath, userId.ToString());
            if (!Directory.Exists(userPath))
            {
                Directory.CreateDirectory(userPath);
            }
            string snapshotsPath = Path.Combine(userPath, "Snapshots");
            if (!Directory.Exists(snapshotsPath))
            {
                Directory.CreateDirectory(snapshotsPath);
            }
        }

        public void DeleteAllChunks(string fileName)
        {
            string[] filePaths = Directory.GetFiles(_tempPath)
                .Where(p => p.Contains(Path.GetFileNameWithoutExtension(fileName))).ToArray();

            foreach (string path in filePaths)
            {
                File.Delete(path);
            }
        }

        private static void MergeChunks(string chunk1, string chunk2)
        {
            FileStream fs1 = null;
            FileStream fs2 = null;
            try
            {
                fs1 = File.Open(chunk1, FileMode.Append);
                fs2 = File.Open(chunk2, FileMode.Open);
                byte[] fs2Content = new byte[fs2.Length];
                fs2.Read(fs2Content, 0, (int)fs2.Length);
                fs1.Write(fs2Content, 0, (int)fs2.Length);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message + " : " + ex.StackTrace);
            }
            finally
            {
                if (fs1 != null) fs1.Close();
                if (fs2 != null) fs2.Close();
                File.Delete(chunk2);
            }
        }

        public async Task<byte[]> GetVideoThumbnail(Guid userId, Guid videoId)
        {
            string userPath = Path.Combine(_uploadPath, userId.ToString());
            string snapshotsPath = Path.Combine(userPath, "Snapshots");
            string thumbnailPath = Path.Combine(snapshotsPath, videoId + ".png");
            byte[] videoBytes = await File.ReadAllBytesAsync(thumbnailPath);
            return videoBytes;
        }

        public async Task<MemoryStream> GetVideosZipFileStream(List<Video> videos)
        {
            string zipName = Guid.NewGuid() + ".zip";
            string zipCreatePath = Path.Combine(_uploadPath, zipName);

            using (ZipArchive archive = ZipFile.Open(zipCreatePath, ZipArchiveMode.Create))
            {
                foreach(var video in videos)
                {
                    archive.CreateEntryFromFile(video.Path, video.Title + Path.GetExtension(video.Path));
                }
            }

            var memory = new MemoryStream();
            await using (var stream = new FileStream(zipCreatePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;

            File.Delete(zipCreatePath);
            return memory;
        }

        public async Task<long> GetUserVideosSize(Guid userId)
        {
            var videos = await _videosRepository.GetAllVideosByUserId(userId);
            long size = videos.Select(video => video.Size).Sum();
            return size;
        }

        public async Task MarkVideoForDeletion(Video video)
        {
            video.DeleteDate = DateTime.Today;
            await _videosRepository.Save();
        }

        public async Task RestoreVideo(Video video)
        {
            video.DeleteDate = null;
            await _videosRepository.Save();
        }

        public async Task DeleteVideosAutomation()
        {
            var videos = await _videosRepository.GetDeletedVideosOlderThanDays(30);
            foreach(var video in videos)
            {
                try
                {
                    await DeleteVideo(video, video.UserId);
                }
                catch(Exception)
                {
                    continue;
                }
            }
        }
    }
}