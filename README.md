# excel-ent

## Installation of the project :

```sh
cd backend && npm install
cd ../frontend && npm install
```

## Database create and user create
```sh
CREATE USER 'excelent_user'@'localhost' IDENTIFIED BY 'excelent_password';
mysql -u user < database.sql
GRANT ALL PRIVILEGES ON excelent.* TO 'excelent_user'@'localhost';
FLUSH PRIVILEGES;
```

## Files to add

-   backend/.env :
```sh
SRV_PORT = 8888

DB_NAME = 'excelent'
DB_USER = 'excelent_user'
DB_PASS = 'excelent_pass'
DB_HOST = 'localhost'

BCRYPT_SALT_ROUNDS = 12

JWT_SECRET = "secret"
JWT_DURATION = "1d"
```

-   frontend/.env :
```sh
VITE_API_URL = http://localhost:8888
```
## Before commit
Don't forget to format your project with the command :
```sh
npm run format
```
