// const router = require("express").Router();
// const { readdirSync, readFileSync } = require('fs-extra');
// const path = require('path');

// try {
//   // ------------------------------------------------------------------------//
//   // ------------------------/     Fodel public    /-------------------------//
//   // ------------------------------------------------------------------------//
//   var i, j, n = 0;
//   const srcPath = path.join(__dirname, "/public/");
//   const hosting = readdirSync(srcPath).filter((file) => file.endsWith(".js"));
//   for (i of hosting) {
//     const { index, name } = require(srcPath + i);
//     router.get(name, index);
//     n++
//     console.log(i);
//   }

//   // for 'post' folder
//   const srcPathPost = path.join(__dirname, "/post/");
//   const hostingPost = readdirSync(srcPathPost).filter((file) => file.endsWith(".js"));
//   for (j of hostingPost) {
//     const { index, name } = require(srcPathPost + j);
//     router.post(name, index);
//     n++
//     console.log('post/' + j);
//   }


//   router.get('/altp_data', function (req, res) {
//     const data = JSON.parse(readFileSync('./altp_data.json', "utf-8"));
//     res.header("Content-Type", 'application/json');
//     res.send(JSON.stringify(data, null, 4));
//   });
//   // ------------------------------------------------------------------------//
//   // ----------------------------/     Fodel    /----------------------------//
//   // ------------------------------------------------------------------------//
//   const getDirs = readdirSync(srcPath).filter((file) => !file.endsWith(".js") && !file.endsWith(".json"));
//   for (const dir of getDirs) {
//     const fileName = readdirSync(path.join(__dirname, '/public/' + dir + '/')).filter((file) => file.endsWith(".js"));
//     for (j of fileName) {
//       const { index, name } = require(path.join(__dirname, '/public/' + dir + '/') + j);
//       router.get(name, index);
//       n++
//       // console.log('\x1b[38;5;220m[ LOADING ] \x1b[33m→\x1b[40m\x1b[1m\x1b[38;5;161m Đã tải thành công ' + j);
//     }
//   }

//   // for 'post' folder
//   const getDirsPost = readdirSync(srcPathPost).filter((file) => !file.endsWith(".js") && !file.endsWith(".json"));
//   for (const dir of getDirsPost) {
//     const fileName = readdirSync(path.join(__dirname, '/post/' + dir + '/')).filter((file) => file.endsWith(".js"));
//     for (j of fileName) {
//       const { index, name } = require(path.join(__dirname, '/post/' + dir + '/') + j);
//       router.post(name, index);
//       n++
//       // console.log('\x1b[38;5;220m[ LOADING ] \x1b[33m→\x1b[38;5;197m Đã tải thành công POST/' + j);
//     }
//   }
//   console.log(`\x1b[38;5;220m[ LOADING ] \x1b[33m→\x1b[38;5;197m Đã load thành công ${n} file API`);
// } catch (e) { console.log(e); }

// // -------------------------->      END     <------------------------------//
// module.exports = router;


const express = require('express');
const router = express.Router();
const { readdirSync, readFileSync } = require('fs-extra');
const path = require('path');

function loadRoutesFromDirectory(dirPath, method) {
  const files = readdirSync(dirPath).filter(file => file.endsWith('.js'));
  for (const file of files) {
    try {
      const { index, name } = require(path.join(dirPath, file));
      router[method](name, index);
      console.log(`${method.toUpperCase()}/${file}`);
    } catch (error) {
      console.error(`Error loading route from ${file}:`, error.message);
    }
  }
}

try {
  // Load routes from the 'public' directory
  const publicPath = path.join(__dirname, 'public');
  loadRoutesFromDirectory(publicPath, 'get');

  // Load routes from the 'post' directory
  const postPath = path.join(__dirname, 'post');
  loadRoutesFromDirectory(postPath, 'post');

  // Serve JSON data from 'altp_data.json'
  router.get('/altp_data', (req, res) => {
    try {
      const data = JSON.parse(readFileSync(path.join(__dirname, 'altp_data.json'), 'utf-8'));
      res.header('Content-Type', 'application/json');
      res.send(JSON.stringify(data, null, 4));
    } catch (error) {
      console.error('Error reading altp_data.json:', error.message);
      res.status(500).send('Internal Server Error');
    }
  });

  // Load routes from subdirectories in 'public'
  const publicDirs = readdirSync(publicPath).filter(file => !file.endsWith('.js') && !file.endsWith('.json'));
  for (const dir of publicDirs) {
    const dirPath = path.join(publicPath, dir);
    if (readdirSync(dirPath).some(file => file.endsWith('.js'))) {
      loadRoutesFromDirectory(dirPath, 'get');
    }
  }

  // Load routes from subdirectories in 'post'
  const postDirs = readdirSync(postPath).filter(file => !file.endsWith('.js') && !file.endsWith('.json'));
  for (const dir of postDirs) {
    const dirPath = path.join(postPath, dir);
    if (readdirSync(dirPath).some(file => file.endsWith('.js'))) {
      loadRoutesFromDirectory(dirPath, 'post');
    }
  }

  console.log(`\x1b[38;5;220m[ LOADING ] \x1b[33m→\x1b[38;5;197m Successfully loaded API files.`);
} catch (error) {
  console.error('Error during route setup:', error.message);
}

module.exports = router;
