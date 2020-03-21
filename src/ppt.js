const transMD = require("./md.js")
var ejs = require('ejs');
var fs = require('fs');
var open = require('open');
var connect = require('connect');
var serveStatic = require('serve-static');



function ppt(commands, argv) {
  if (argv.version || argv.V) {
    console.log(require('../package.json').version)
    return;
  }

  if (argv.help || argv.h){
    console.log('Example:')
    console.log('-----------------')
    console.log('ppt file.md ')
    console.log('ppt xxx.md --theme=black --transition=zoom')
    console.log('-----------------')
    console.log('Params:')
    console.log('-----------------')
    console.log('theme: beige, black, blood, league, moon, night, serif, simple, sky, solarized, white')
    console.log('transition: none, fade, slide, convex, concave, zoom')
    console.log('align: center, left, right')
    console.log('title: whatever')
    console.log('-----------------')
    return
  }

  if (commands.length === 1 && /\.md$/.test(commands[0])) {
    createHTML(commands[0], argv);
    return;
  }


  console.log('Invalid Command!!!')
}


function createHTML(fullPath, argv) {
  const filePath = fullPath.replace(/\.md$/, "")
  const fileName = filePath.match("\/?([^/]+$)")[1]


  transMD(fullPath, (html) => {
    const data = {
      title: argv.title || fileName,
      html: html,
      theme: argv.theme || "solarized", // beige, black, blood, league, moon, night, serif, simple, sky, solarized, white
      transition: argv.transition || "slide", // none/fade/slide/convex/concave/zoom
      align: argv.align ? "align-" + argv.align : "align-center", // Default content align
      css: argv.css || null, // css url
      js: argv.js || null, // js url
    }


    ejs.renderFile(__dirname + '/template.ejs', data, (err, str) => {
      if (err) throw err;
      const dir = process.cwd() + "/ppt-html/"
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      fs.writeFile(dir + fileName + '.html', str, (err) => {
        if (err) throw err;
        connect()
          .use(serveStatic(dir, {
            'index': ['index.html', 'default.htm']
          }))
          .listen(8888);

        console.log('Listening on port 8888. open http://localhost:8888/' + fileName + '.html');
        open('http://localhost:8888/' + fileName + '.html');
      });
    });
  })

}



module.exports = ppt
