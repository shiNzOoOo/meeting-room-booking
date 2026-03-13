USE MeetingRoomBooking;

-- Seed admin user: admin@system.com / Admin@123
-- BCrypt hash for 'Admin@123'
INSERT INTO Users (Name, Email, PasswordHash, Role)
VALUES ('Admin', 'admin@system.com', '$2a$11$K0xGR1DzJ4fR6r5qVZYwZeQOJ5q8GvQPKMZC5S0VQr5pQoYz5q6Ky', 'admin')
ON DUPLICATE KEY UPDATE Name = Name;

-- Seed some demo rooms
INSERT INTO Rooms (Name, Capacity, IsActive) VALUES
('Conference Room A', 10, 1),
('Board Room', 20, 1),
('Meeting Room B', 6, 1),
('Training Hall', 30, 1)
ON DUPLICATE KEY UPDATE Name = Name;
