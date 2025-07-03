CREATE USER 'nodejs_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON nodejs_api_dev.* TO 'nodejs_user'@'localhost';
FLUSH PRIVILEGES;

ALTER USER 'nodejs_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;