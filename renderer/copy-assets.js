const path = require('path');
const fse = require('fs-extra');
  
fse.copySync(path.resolve('../webapp/app/'), path.resolve('../static/app/'), { overwrite: true }, function (err) {
    if (err) console.error(err);
});
fse.copySync(path.resolve('../webapp/rest/'), path.resolve('../static/rest/'), { overwrite: true }, function (err) {
    if (err) console.error(err);
});
fse.removeSync(path.resolve('../static/app/js/'));
fse.removeSync(path.resolve('../static/app/third-party/source.js'))