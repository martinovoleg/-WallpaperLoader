using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using HtmlAgilityPack;
using Newtonsoft.Json;

namespace goodfonDownloader.Controllers
{


    public class HomeController : Controller
    {
        private string downloadImage(string urlAdress, string category, string index = null)
        {
            try
            {


                HtmlDocument docWithImage = new HtmlDocument();

                using (var wb = new WebClient())
                {
                    var response = wb.DownloadString(urlAdress);
                    docWithImage = new HtmlDocument();
                    docWithImage.LoadHtml(response);
                    wb.Dispose();
                }

                string url = docWithImage.GetElementbyId("im").Attributes["href"].Value;

                using (var webClient = new WebClient())
                {
                    string path_to_image = Server.MapPath("~/App_Data/" + category + "/" + url.Split('/').Last());
                    webClient.Headers.Add("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; .NET CLR 1.0.3705;)");
                    webClient.DownloadFile(url, path_to_image);
                    webClient.Dispose();
                }

            }
            catch (Exception ex)
            {
                return ex.Message;
            }

            return "ok";
        }


        public ActionResult Index()
        {
            return View();
        }

        public string downloadCategoryImageFromPage(string imageLink, string category)
        {
            try
            {
                //var imageLinksList = JsonConvert.DeserializeObject<List<string>>(imageLinks);

                if (!Directory.Exists(Server.MapPath("~/App_Data/" + category + "/")))
                {
                    Directory.CreateDirectory(Server.MapPath("~/App_Data/" + category + "/"));
                }

                downloadImage(imageLink, category);
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
            return "ok";
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}