-- Check the authentication method for the nodejs_user
SELECT User, Host, plugin 
FROM mysql.user 
WHERE User = 'nodejs_user'; 