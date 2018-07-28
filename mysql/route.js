var showPage = require("./showPage");
 
function route(pathname) {
 
  var handle = {}
  handle["/"] = showPage.home;
  handle["/blog"] = showPage.blog;
 
  if (typeof handle[pathname] === 'function') {
    handle[pathname]();
  } else {
    //console.log("40444 Not Found " + pathname);
  }
}
 
exports.route = route;