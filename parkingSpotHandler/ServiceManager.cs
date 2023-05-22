using AForge.Video.DirectShow;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.NetworkInformation;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;

namespace parkingSpotHandler
{
    public class ServiceManager
    {
        private const string RUNNING_PROCESS_ID_FILE = "RunningProcessId.txt"; 
        private const int PORT_MIN = 42689;

        private readonly string m_UserId;


        public ServiceManager(string id)
        {
            m_UserId = id;
        }

        public static IEnumerable<string> GetConnectedCameras()
        {
            FilterInfoCollection videoDevices = new FilterInfoCollection(FilterCategory.VideoInputDevice);

            List<string> cameras = new List<string>();

            for (int i = 0; i < videoDevices.Count; i++)
            {
                FilterInfo device = videoDevices[i];
                cameras.Add(device.Name);
            }

            return cameras;
        }

        public static string GetMachineIp()
        {
            string hostName = Dns.GetHostName();
            string myIP = Dns.GetHostEntry(hostName).AddressList[1].ToString();

            return myIP;
        }

        public static void OpenHistoryFolder()
        {
            string capturesPath = Path.Join(Path.GetDirectoryName(Assembly.GetEntryAssembly().Location), @"capture-handler\captures");
            Process.Start("explorer.exe", capturesPath);
        }

        public static void RestartCaptureService()
        {
            try
            {
                string processId = File.ReadAllText(RUNNING_PROCESS_ID_FILE);

                if (int.TryParse(processId, out int id))
                {
                    Process.GetProcessById(id)?.Kill();
                }
            }
            catch (Exception ex)
            {
            }

            StartCapureServer();
        }

        public static void UpdateParkingCamera(CaptureProcessModel captureProcess)
        {
            string url = $"http://localhost:3000/parks/setCamera";
            string serializedCaptureProcess = JsonSerializer.Serialize(captureProcess);

            using (HttpClient httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
                HttpContent requestBody = new StringContent(serializedCaptureProcess, Encoding.UTF8, "application/json");

                HttpResponseMessage response = httpClient.PutAsync(url, requestBody).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseContent = response.Content.ReadAsStringAsync().Result;
                }
                else
                {

                }
            }
            // TO DO : Update the mongo with the process detailes (ip port and camera name)
        }

        public static IEnumerable<ParkingSpotModel> GetUserParkingSpots(string userId)
        {
            using (HttpClient httpClient = new HttpClient())
            {
                var response = httpClient.GetAsync("http://localhost:3000/parks/parkByOwner/" + userId).Result;
                string responseContent = response.Content.ReadAsStringAsync().Result;
                var parkingSpots = JsonSerializer.Deserialize<IEnumerable<ParkingSpotModel>>(responseContent);

                return parkingSpots;
            }
        }

        public static int StartCapureServer()
        {
            int portNumber = GetAvailablePort();

            string nodePath = "node";

            string serverScriptPath = ".\\capture-handler\\app.js " + portNumber;

            Console.WriteLine("Starting on port: " + portNumber);
            Process capturePrc = new Process();

            try
            {
                capturePrc.StartInfo.FileName = nodePath;
                capturePrc.StartInfo.Arguments = serverScriptPath;
                capturePrc.StartInfo.UseShellExecute = false;
                capturePrc.StartInfo.RedirectStandardOutput = true;
                capturePrc.StartInfo.RedirectStandardError = true;
                capturePrc.StartInfo.CreateNoWindow = true;

                capturePrc.Start();

                File.WriteAllText(RUNNING_PROCESS_ID_FILE, capturePrc.Id.ToString());
            }
            catch (Exception ex)
            {
               Console.WriteLine("An error occurred: " + ex.Message);
            }

            return portNumber;
        }

        private static int GetAvailablePort()
        {
            int startingPort = PORT_MIN;

            IPEndPoint[] endPoints;
            List<int> portArray = new List<int>();

            IPGlobalProperties properties = IPGlobalProperties.GetIPGlobalProperties();

            //getting active connections
            TcpConnectionInformation[] connections = properties.GetActiveTcpConnections();
            portArray.AddRange(from n in connections
                               where n.LocalEndPoint.Port >= startingPort
                               select n.LocalEndPoint.Port);

            //getting active tcp listners - WCF service listening in tcp
            endPoints = properties.GetActiveTcpListeners();
            portArray.AddRange(from n in endPoints
                               where n.Port >= startingPort
                               select n.Port);

            //getting active udp listeners
            endPoints = properties.GetActiveUdpListeners();
            portArray.AddRange(from n in endPoints
                               where n.Port >= startingPort
                               select n.Port);

            portArray.Sort();

            for (int i = startingPort; i < UInt16.MaxValue; i++)
                if (!portArray.Contains(i))
                    return i;

            return 0;
        }

    }
}
