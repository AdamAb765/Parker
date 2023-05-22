using AForge.Video.DirectShow;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace parkingSpotHandler
{
    public class ServiceManager
    {
        private const string RUNNING_PROCESS_ID_FILE = "RunningProcessId.txt"; 
        private const int PORT_MIN = 1000;

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
            // TO DO : Update the mongo with the process detailes (ip port and camera name)
        }

        public static IEnumerable<ParkingSpotModel> GetUserParkingSpots()
        {
            // TO DO: Load all that data from the mongo (route that return akk the parking spots of the user)

            return new List<ParkingSpotModel>() { 
               new ParkingSpotModel() { Id = "1", Name="The bitcher", Address = "Harta bartat 5"},
               new ParkingSpotModel() { Id = "2", Name="Kill bill", Address = "Harta bsdfsdfarsdfsdftat 5"},
               new ParkingSpotModel() { Id = "4", Name="Close One", Address = "Moresher 3"},
               new ParkingSpotModel() { Id = "5", Name="Lister bister", Address = "Ha bartat 5"},
            };

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
