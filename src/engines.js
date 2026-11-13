import { removeBackground } from "@imgly/background-removal";
import { jsPDF } from "jspdf";

export async function removeBg(file, onProgress) {
  return removeBackground(file, {
    model: "medium",
    output: { format: "image/png", quality: 0.95 },
    progress: (key, current, total) => {
      if (total > 0) onProgress?.(Math.round(current / total * 100), key);
    }
  });
}

export async function describeImage(file, onProgress) {
  const { pipeline, env } = await import("@huggingface/transformers");
  env.allowLocalModels = false;
  env.useBrowserCache = true;
  const captioner = await pipeline("image-to-text", "Xenova/vit-gpt2-image-captioning", {
    progress_callback: p => {
      if (p?.progress != null) onProgress?.(Math.round(p.progress), p.file || "Loading AI model");
    }
  });
  const url = URL.createObjectURL(file);
  try {
    const result = await captioner(url, { max_new_tokens: 48 });
    return result?.[0]?.generated_text?.trim() || "No description was generated.";
  } finally { URL.revokeObjectURL(url); }
}

export async function makePdf(imageDataUrl, options = {}) {
  const { page = "a4", orientation = "portrait", margin = 10 } = options;
  const pdf = new jsPDF({ orientation, unit: "mm", format: page });
  const pw = pdf.internal.pageSize.getWidth(), ph = pdf.internal.pageSize.getHeight();
  const maxW = pw - margin * 2, maxH = ph - margin * 2;
  const img = new Image();
  await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = imageDataUrl; });
  const scale = Math.min(maxW / img.width, maxH / img.height);
  const w = img.width * scale, h = img.height * scale;
  pdf.addImage(imageDataUrl, "PNG", (pw-w)/2, (ph-h)/2, w, h);
  return pdf.output("blob");
}

export function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not read this image.")); };
    img.src = url;
  });
}

export function canvasBlob(canvas, type = "image/png", quality = 0.92) {
  return new Promise((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("Image export failed.")), type, quality));
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function passportCanvas(img, preset = "india") {
  const presets = {
    india: { w: 413, h: 531, label: "India passport · 35 × 45 mm" },
    square: { w: 600, h: 600, label: "Square · 2 × 2 inch" },
    visa: { w: 600, h: 600, label: "Visa photo · 2 × 2 inch" }
  };
  const p = presets[preset] || presets.india, c = document.createElement("canvas");
  c.width = p.w; c.height = p.h;
  const x = c.getContext("2d");
  x.fillStyle = "#ffffff"; x.fillRect(0, 0, c.width, c.height);
  const scale = Math.max(c.width / img.width, c.height / img.height);
  const sw = c.width / scale, sh = c.height / scale;
  const sx = (img.width - sw) / 2, sy = (img.height - sh) / 2;
  x.drawImage(img, sx, sy, sw, sh, 0, 0, c.width, c.height);
  return c;
}
