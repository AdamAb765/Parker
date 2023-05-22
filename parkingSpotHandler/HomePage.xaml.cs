using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace parkingSpotHandler
{
    /// <summary>
    /// Interaction logic for HomePage.xaml
    /// </summary>
    public partial class HomePage : Window
    {
        public HomePage()
        {
            InitializeComponent();

            CameraComboBox.ItemsSource = ServiceManager.GetConnectedCameras().ToList();
            ParkingComboBox.ItemsSource = ServiceManager.GetUserParkingSpots().ToList();

            CameraComboBox.SelectedItem = CameraComboBox.Items[0];
            ParkingComboBox.SelectedItem = ParkingComboBox.Items[2];
        }

        private void RestartBtn_Click(object sender, RoutedEventArgs e)
        {
            ServiceManager.RestartCaptureService();
        }

        private void AddParkingBtn_Click(object sender, RoutedEventArgs e)
        {
            addCameraSection.Visibility = addCameraSection.Visibility == Visibility.Visible ? Visibility.Collapsed:
                                                                                              Visibility.Visible;
        }

        private void HistoryBtn_Click(object sender, RoutedEventArgs e)
        {
            ServiceManager.OpenHistoryFolder();
        }

        private void SaveBtn_Click(object sender, RoutedEventArgs e)
        {
            CaptureProcessModel capture = new CaptureProcessModel();

            capture.Ip = ServiceManager.GetMachineIp();
            capture.Port = ServiceManager.StartCapureServer();
            capture.CameraName = CameraComboBox.SelectedItem.ToString();
            capture.ParkingId = (ParkingComboBox.SelectedItem as ParkingSpotModel).Id;

            ServiceManager.UpdateParkingCamera(capture);
        }
    }
}
