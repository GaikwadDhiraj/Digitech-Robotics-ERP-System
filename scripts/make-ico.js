const fs = require("fs");
const path = require("path");

const pngPath = path.join(__dirname, "..", "public", "favicon.png");
const png = fs.readFileSync(pngPath);

const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type 1 = ICO
header.writeUInt16LE(1, 4); // 1 image
header.writeUInt8(0, 6); // width 256
header.writeUInt8(0, 7); // height 256
header.writeUInt8(0, 8); // color count 0
header.writeUInt8(0, 9); // reserved 0
header.writeUInt16LE(1, 10); // color planes
header.writeUInt16LE(32, 12); // bpp
header.writeUInt32LE(png.length, 14); // image size
header.writeUInt32LE(22, 18); // offset 22

const ico = Buffer.concat([header, png]);
fs.writeFileSync(path.join(__dirname, "..", "public", "favicon.ico"), ico);

console.log("Successfully created valid public/favicon.ico, size:", ico.length);
