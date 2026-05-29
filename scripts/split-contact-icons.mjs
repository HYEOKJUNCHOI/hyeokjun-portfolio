// icon.png(2x2: 카카오/깃허브/브런치/이메일)을 4개로 분리.
// 흰 배경 + 옅은 그림자는 제외하고 '잉크(어둡거나 채도 있는 타일)'의 바운딩박스만 직접 스캔해 타이트 크롭.
// sharp 는 Rutibooki 설치본을 절대경로로 빌려 씀.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('C:/Users/gurwn/Desktop/Project/Rutibooki/node_modules/sharp');
import fs from 'fs';

const SRC = 'C:/Users/gurwn/Desktop/쇼케이스/쇼케이스 이미지/icon.png';
const OUT = 'C:/Users/gurwn/Desktop/Project/hyeokjun-portfolio/public/contact';
fs.mkdirSync(OUT, { recursive: true });

const m = await sharp(SRC).metadata();
const W = m.width, H = m.height;
const hw = Math.floor(W / 2), hh = Math.floor(H / 2);
console.log('source', `${W}x${H}`);

// 좌상=카카오, 우상=깃허브, 좌하=브런치, 우하=이메일
const quads = {
  kakao:  { left: 0,  top: 0,  width: hw,     height: hh },
  github: { left: hw, top: 0,  width: W - hw, height: hh },
  brunch: { left: 0,  top: hh, width: hw,     height: H - hh },
  email:  { left: hw, top: hh, width: W - hw, height: H - hh },
};

// 배경(흰색/옅은 그림자) = 모든 채널이 LIGHT 이상. 그 외 = 잉크.
const LIGHT = 208;

for (const [name, q] of Object.entries(quads)) {
  const buf = await sharp(SRC).extract(q).png().toBuffer();
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      // 알파 있으면 투명=배경, 없으면 밝은 픽셀=배경.
      const isBg = channels === 4
        ? data[i + 3] < 24
        : (r >= LIGHT && g >= LIGHT && b >= LIGHT);
      if (!isBg) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const cw = maxX - minX + 1, ch = maxY - minY + 1;
  await sharp(buf)
    .extract({ left: minX, top: minY, width: cw, height: ch })
    .png()
    .toFile(`${OUT}/${name}.png`);
  console.log(name, `${cw}x${ch}`, `(bbox x:${minX}-${maxX} y:${minY}-${maxY})`);
}
console.log('done');
