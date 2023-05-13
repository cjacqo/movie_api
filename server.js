const http = require('http'),
      fs   = require('fs'),
      url  = require('url')

http.createServer((req, res) => {
  // Declare variables to...
  // 1 - the requested URL
  // 2 - the parsed URL
  // 3 - empty filePath
  let addr = req.url,
      q    = url.parse(addr, true),
      filePath = ''

  // Dynamically log recent requests to help debug code,
  // track the most visited URLs, and more
  fs.appendFile('log.txt', `URL: ${addr}\n TimeStamp: ${new Date()}\n\n`, (err) => {
    if (err) console.error(err)
    else console.log('Added to log')
  })
  
  // Check if a path name includes 'documentation'
  // If not, set filePath to the index.html file
  if (q.pathname.includes('documentation')) {
    filePath = (__dirname + '/documentation.html')
  } else {
    filePath = 'index.html'
  }

  // Grab the appropriate file from the server based on filePath
  fs.readFile(filePath, (err, data) => {
    if (err) throw err
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.write(data)
    res.end()
  })
}).listen(8080)

console.log('Node test server is running on Port 8080.')