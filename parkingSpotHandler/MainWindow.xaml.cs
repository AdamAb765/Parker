using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace parkingSpotHandler
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private HttpClient m_Client;

        public MainWindow()
        {
            InitializeComponent();
            m_Client = new HttpClient();
        }

        private void BtnLogin_Click(object sender, RoutedEventArgs e)
        {
            string url = "http://localhost:3000/users/login";
            string username = txtUsername.Text;
            string password = txtPassword.Password;

            using (HttpClient httpClient = new HttpClient())
            {
                var formData = new FormUrlEncodedContent(new[]
                {
                     new KeyValuePair<string, string>("email", username),
                     new KeyValuePair<string, string>("password", password)
                 });

                HttpResponseMessage response = httpClient.PostAsync(url, formData).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseContent = response.Content.ReadAsStringAsync().Result;
                    var dictionary = JsonSerializer.Deserialize<Dictionary<string, object>>(responseContent);
                    dictionary.TryGetValue("id", out object id);
                    HomePage homePage = new HomePage(id.ToString());
                    homePage.Show();
                    Close();
                    Console.WriteLine(responseContent);
                }
                else
                {
                    txtError.Text = "Invalid mail or password";
                    Console.WriteLine("Request failed with status code: " + response.StatusCode);
                }
            }
        }
    }
}
