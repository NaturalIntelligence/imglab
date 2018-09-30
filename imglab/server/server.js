
const Koa = require("koa2")

const path = require("path")

const views = require("koa-views")

const staticServer = require('koa-static');

const app = new Koa()

//指定静态资源 
const static = "../app"

app.use(staticServer(
    path.join(__dirname,static)
))

app.use(views(path.join("../imglab/app"), {
    extension: 'html'
}))

app.use(async (ctx) => {
    await ctx.render('index')
})

app.listen(3000)