using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.IO;
using RestAPI.Services.JwtAuthentication;
using Serilog;
using Serilog.Events;

namespace RestAPI.Middleware
{
    public class LoggingMiddleware
    {
        private const string ResponseMessageTemplate = "HTTP RESPONSE {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms Response Body: {ResponseBody}. {User}";
        private const string RequestMessageTemplate = "HTTP REQUEST {RequestMethod} {RequestPath} QueryString: {QueryString} RequestBody: {RequestBody}";
        private const int MaxContentLength = 20480;

        private static readonly ILogger Logger = Log.ForContext<LoggingMiddleware>();
        private readonly RecyclableMemoryStreamManager _recyclableMemoryStreamManager;
        readonly RequestDelegate _next;

        public LoggingMiddleware(RequestDelegate next)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
            _recyclableMemoryStreamManager = new RecyclableMemoryStreamManager();
        }

        public async Task Invoke(HttpContext httpContext, IJwtAuthentication jwtAuthentication)
        {
            if (httpContext == null)
            {
                throw new ArgumentNullException(nameof(httpContext));
            }

            var sw = new Stopwatch();
            try
            {
                await LogRequest(httpContext);
                await LogResponse(httpContext, jwtAuthentication, sw);
            }

            catch (Exception ex) when (LogException(httpContext, sw, ex)) { }
        }

        private static bool LogException(HttpContext httpContext, Stopwatch sw, Exception ex)
        {
            sw.Stop();

            LogForErrorContext(httpContext)
                .Error(ex, ResponseMessageTemplate, httpContext.Request.Method, httpContext.Request.Path, 500, sw.Elapsed.TotalMilliseconds);

            return false;
        }

        private static ILogger LogForErrorContext(HttpContext httpContext)
        {
            var request = httpContext.Request;

            var result = Logger
                .ForContext("RequestHeaders", request.Headers.ToDictionary(
                    h => h.Key, 
                    h => h.Value.ToString()), true)
                .ForContext("RequestHost", request.Host)
                .ForContext("RequestProtocol", request.Protocol);

            if (request.HasFormContentType)
            {
                result = result.ForContext(
                    "RequestForm", 
                    request.Form.ToDictionary(
                        v => v.Key, 
                        v => v.Value.ToString()));
            }
            return result;
        }

        private async Task LogResponse(HttpContext httpContext, IJwtAuthentication jwtAuthentication, Stopwatch sw)
        {
            var originalBodyStream = httpContext.Response.Body;
            var responseBody = string.Empty;

            await using var responseBodyStream = _recyclableMemoryStreamManager.GetStream();
            httpContext.Response.Body = responseBodyStream;

            sw.Start();
            await _next(httpContext);
            sw.Stop();

            httpContext.Response.Body.Seek(0, SeekOrigin.Begin);

            var responseLength = httpContext.Response.Body.Length;
            if (responseLength is < MaxContentLength and > 0)
            {
                responseBody = await new StreamReader(httpContext.Response.Body).ReadToEndAsync();
            }
            else if (responseLength > MaxContentLength)
            {
                responseBody = $"Request Body exceeded {MaxContentLength} characters";
            }
            else
            {
                responseBody = "Empty";
            }

            httpContext.Response.Body.Seek(0, SeekOrigin.Begin);

            await responseBodyStream.CopyToAsync(originalBodyStream);

            var statusCode = httpContext.Response?.StatusCode;
            var level = statusCode > 499 ? LogEventLevel.Error : LogEventLevel.Information;

            var logger = level == LogEventLevel.Error ? LogForErrorContext(httpContext) : Logger;

            var token = await httpContext.GetTokenAsync("access_token");
            var user = string.Empty;

            if (token is not null)
            {
                var userId = jwtAuthentication.ManualValidation(token);

                user = userId is null
                    ? string.Empty
                    : $"UserId: {userId}";
            }

            logger.Write(level, ResponseMessageTemplate, httpContext.Request.Method, httpContext.Request.Path, statusCode, sw.Elapsed.TotalMilliseconds, responseBody ,user);
        }

        private async Task LogRequest(HttpContext httpContext)
        {
            httpContext.Request.EnableBuffering();
            httpContext.Request.Body.Position = 0;

            var requestBody = string.Empty;
            if (httpContext.Request.ContentLength is not null && httpContext.Request.ContentLength <= MaxContentLength)
            {
                await using var requestStream = _recyclableMemoryStreamManager.GetStream();
                await httpContext.Request.Body.CopyToAsync(requestStream);
                requestBody = ReadStreamInChunks(requestStream);
            }
            else if(httpContext.Request.ContentLength > MaxContentLength)
            {
                requestBody = $"Request Body exceeded {MaxContentLength} characters";
            }
            else
            {
                requestBody = "Empty";
            }

            httpContext.Request.Body.Position = 0;

            var queryString = httpContext.Request.QueryString.HasValue 
                ? httpContext.Request.QueryString.Value 
                : "Empty";

            Logger.Information(RequestMessageTemplate, httpContext.Request.Method, httpContext.Request.Path, queryString, requestBody);
        }

        private static string ReadStreamInChunks(Stream stream)
        {
            const int readChunkBufferLength = 4096;
            stream.Seek(0, SeekOrigin.Begin);
            using var textWriter = new StringWriter();
            using var reader = new StreamReader(stream);
            var readChunk = new char[readChunkBufferLength];
            int readChunkLength;
            do
            {
                readChunkLength = reader.ReadBlock(readChunk,
                    0,
                    readChunkBufferLength);
                textWriter.Write(readChunk, 0, readChunkLength);
            } while (readChunkLength > 0);
            return textWriter.ToString();
        }
    }
}