module.exports = {
    configureWebpack: {
        devtool: 'source-map',
    },
    pages: {
        index: {
            // entry for the page
            entry: 'src/main.js',
            // the source template
            template: 'public/index.html',
            // output as dist/index.html
            filename: 'index.html',
            // when using title option,
            // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'Alter Fr!tz'
        }
    },
    devServer: {
        proxy: {
            '^/api/fritz/box': {
                target: 'http://alter.fritz',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api/fritz/box': ''
                },
                disableHostCheck: true
            }
        }
    }
};
