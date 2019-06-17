using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FileUploadAPI.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private IHostingEnvironment _hostingEnvironment ;

        public UploadController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpPost("UploadFile"),DisableRequestSizeLimit]
        public async Task<ActionResult> UploadFileAsync(FileModel fileModel)
        {
            try
            {

                await Task.Delay(3000);

                var file = Request.Form.Files[0];
                string folderName = "Upload";
                string webRootPath = _hostingEnvironment.WebRootPath;
                string newPath = Path.Combine(webRootPath, folderName);
                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }
                if (file.Length > 0)
                {
                    string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string fullPath = Path.Combine(newPath, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
                return Ok("Upload Successful.");
            }
            catch (System.Exception ex)
            {
                return BadRequest("Upload Failed: " + ex.Message);
            }
        }
    }

    public class FileModel
    {
        public int Id { get; set; }
        public string Description { get; set; }
    }
}