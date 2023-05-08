import { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import path from "path";

const isDev = process.env.NODE_ENV === "development";

const common: Configuration = {
  mode: isDev ? "development" : "production",
  externals: ["fsevents"],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  output: {
    path: path.resolve(__dirname, "../../dist/web"),
    publicPath: "/",
    assetModuleFilename: "assets/[name][ext]",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: { configFile: path.resolve(__dirname, "./.babelrc") },
          },
          "ts-loader",
        ],
      },
      {
        test: /\.(png)/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "images/[name].[ext]",
            },
          },
        ],
      },
    ],
  },
  watch: isDev,
  devtool: isDev ? "source-map" : undefined,
};

const renderer: Configuration = {
  ...common,
  target: "web",
  entry: { app: path.resolve(__dirname, "./src/index.tsx") },
  plugins: [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
    }),
  ],
};

export default [renderer];
