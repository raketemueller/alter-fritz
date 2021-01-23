module.exports = {
    configureWebpack: {
        devtool: 'source-map',
    },
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://alter.fritz',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                },
                disableHostCheck: true
            }
        }
    }
};
