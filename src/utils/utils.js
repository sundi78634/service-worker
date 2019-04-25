/**
 * @author Sun
 * @description Utils
 */

const fs = require('fs');
const path = require('path');

export function getFilesName(dir) {
  let filePaths = [];
  return new Promise((resolve, reject) => {
    let dirPath = path.resolve(__dirname, dir);
    let recursion = function (_path) {
      fs.readdir(_path, function (err, files) {
        if (err) {
          reject(`文件路径错误: ${err}`);
        } else {
          files.forEach(function (file) {
            let filePath = path.join(_path, file);
            fs.stat(filePath, function (err, stats) {
              if (err) {
                reject(`文件stats错误: ${err}`);
              } else {
                if (stats.isFile()) {
                  filePaths.push(filePath);
                  console.log(filePaths);
                }
                if (stats.isDirectory()) {
                  recursion(filePath);
                }
              }
            })
          })
        }
      })
    };
    recursion(dirPath);
    resolve(filePaths);
  })
}

export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

