# excel-ent

## Installation of the project :

```sh
cd backend && npm install
cd ../frontend && npm install
```

Don't forget to add the db script to your database and adapt the db name.

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
JWT_DURATION = "3600"
```
## Before commit
Don't forget to format your project with the command :
```sh
npm run format
```
