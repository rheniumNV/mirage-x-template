import fs from "fs";
import path from "path";

// コマンドライン引数を出力する
console.log(process.argv);

fs.copyFileSync(
  path.resolve(__dirname, "./index.json"),
  path.resolve(__dirname, "../neos/src/static/NeosFeedback.json")
);
