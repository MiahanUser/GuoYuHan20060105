
/**
 * 纯本地视觉引擎：保证 100% 确定性的极致美感，不依赖任何外部 AI。
 */

export interface VisionResult {
  imageUrl: string;
  poem: string;
}

const POEMS = [
  "在万物静默的时刻，\n宇宙将星光收拢。\n禹含，你是那唯一的引力，\n让记忆在深处永恒。",
  "跨越千万个光年的孤独，\n只为捕捉你眼底的温柔。\n郭禹含，这世界即便荒芜，\n你也是我最后的绿洲。",
  "星河滚烫，时光无声，\n你是不灭的灯火，是晚归的星辰。\n在记忆的炼金炉里，\n禹含是唯一的真金。",
  "当所有的光影重叠，\n所有的喧嚣退后。\n郭禹含，我只在岁月的长廊里，\n看见你如初的惊鸿。",
  "如果时间有形状，\n那一定是你的轮廓。\n如果记忆有颜色，\n那一定是禹含带来的金晖。"
];

export const processLocalVision = (base64: string): Promise<VisionResult> => {
  return new Promise((resolve) => {
    // 增加仪式感的加载时间，模拟某种“跨维度”的提取
    const delay = 3000 + Math.random() * 2000;
    
    setTimeout(() => {
      const randomPoem = POEMS[Math.floor(Math.random() * POEMS.length)];
      resolve({
        imageUrl: base64,
        poem: randomPoem
      });
    }, delay);
  });
};
