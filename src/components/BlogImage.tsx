"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export function isImageAddress(value: string): boolean {
  if (/^\/images\/[\w ()-]+\.(png|webp|jpe?g|gif)$/i.test(value)) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export default function BlogImage({ src, alt, ...props }: Omit<ImageProps, "src"> & { src: string }) {
  const [broken, setBroken] = useState("");
  const usable = src !== broken && isImageAddress(src);
  return <Image {...props} unoptimized referrerPolicy="no-referrer" src={usable ? src : "/images/blogs.png"}
    alt={alt} onError={usable ? () => setBroken(src) : undefined} />;
}

export function Avatar({ src, name }: { src: string; name: string }) {
  const [broken, setBroken] = useState("");
  if (!src || src === broken || !isImageAddress(src)) {
    return <span aria-label={name} className="inline-grid h-12 w-12 place-items-center rounded-full bg-blue-100 font-semibold text-blue-800">{Array.from(name.trim())[0] || "•"}</span>;
  }
  return <Image unoptimized referrerPolicy="no-referrer" width={48} height={48} src={src} alt={name}
    className="h-12 w-12 rounded-full object-cover" onError={() => setBroken(src)} />;
}
