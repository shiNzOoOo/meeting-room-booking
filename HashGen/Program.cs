using System;
using MySqlConnector;

class Program
{
    static void Main()
    {
        string expectedPassword = "Admin@123";
        string hash = BCrypt.Net.BCrypt.HashPassword(expectedPassword);
        
        string connStr = "Server=localhost;Database=MeetingRoomBooking;User=root;Password=;";
        using (var conn = new MySqlConnection(connStr))
        {
            conn.Open();
            var cmd = new MySqlCommand("UPDATE Users SET PasswordHash = @hash WHERE Email = 'admin@system.com'", conn);
            cmd.Parameters.AddWithValue("@hash", hash);
            cmd.ExecuteNonQuery();
            
            Console.WriteLine("Successfully updated DB with strong BCrypt hash: " + hash);
        }
    }
}
