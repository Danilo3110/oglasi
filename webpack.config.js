const path = require("path");

module.exports = {
    entry: {
        main: "./src/js/main.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js"
    },
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: { loader: "babel-loader" }
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" }, // creates style nodes from JS strings
                    { loader: "css-loader" }, // translates CSS into CommonJS
                    { loader: "postcss-loader",
                        options: { config: { path: `${__dirname}/postcss.config.js` } } 
                    }
                ]
            }
        ]
    }
};