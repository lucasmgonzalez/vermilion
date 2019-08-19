module.exports = {
  client: env('DB_CLIENT', "sqlite3"),
  
  filename: rootPath(env('DB_FILENAME', 'mydb.sqlite')),
  
  host: env('DB_HOST', '127.0.0.1'),
  
  name: env('DB_NAME', 'database'),
  
  user: env('DB_USER', 'root'),
  
  password: env('DB_PASSWORD', 'secret')
}
