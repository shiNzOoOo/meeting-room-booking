USE MeetingRoomBooking;
UPDATE Users 
SET PasswordHash = '$2a$11$GgubpaDjmio2KBN3lzAZUGiyLaH0bmyHYZfjty3XqzMvVvE4VIfzC' 
WHERE Email = 'admin@system.com';
