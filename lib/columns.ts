import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const COLUMNS_DIR = path.join(process.cwd(), "content", "columns");

export type ColumnMeta = {
  slug: string;
  title: string;
  date: string; // ISO string, e.g. "2026-07-01"
  excerpt: string;
  tags: string[];
  author: string;
  readingTime: number; // minutes
};

export type Column = ColumnMeta & {
  html: string;
};

function readingTimeOf(markdown: string): number {
  const text = markdown.replace(/[#>*`_\-\[\]()!]/g, "");
  // 以中文為主：約每分鐘 400 字
  const chars = text.replace(/\s/g, "").length;
  return Math.max(1, Math.round(chars / 400));
}

function toMeta(fileName: string): ColumnMeta {
  const slug = fileName.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(COLUMNS_DIR, fileName), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ? new Date(data.date).toISOString().slice(0, 10) : "",
    excerpt: data.excerpt ?? "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    author: data.author ?? "陳孟宏",
    readingTime: readingTimeOf(content),
  };
}

export function getAllColumns(): ColumnMeta[] {
  if (!fs.existsSync(COLUMNS_DIR)) return [];
  return fs
    .readdirSync(COLUMNS_DIR)
    .filter((f) => /\.mdx?$/.test(f) && !f.startsWith("_") && f.toLowerCase() !== "readme.md")
    .map(toMeta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getColumnSlugs(): string[] {
  if (!fs.existsSync(COLUMNS_DIR)) return [];
  return fs
    .readdirSync(COLUMNS_DIR)
    .filter((f) => /\.mdx?$/.test(f) && !f.startsWith("_") && f.toLowerCase() !== "readme.md")
    .map((f) => f.replace(/\.mdx?$/, ""));
}

export function getColumn(slug: string): Column | null {
  const mdPath = path.join(COLUMNS_DIR, `${slug}.md`);
  const mdxPath = path.join(COLUMNS_DIR, `${slug}.mdx`);
  const filePath = fs.existsSync(mdPath) ? mdPath : fs.existsSync(mdxPath) ? mdxPath : null;
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const html = marked.parse(content, { async: false }) as string;

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ? new Date(data.date).toISOString().slice(0, 10) : "",
    excerpt: data.excerpt ?? "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    author: data.author ?? "陳孟宏",
    readingTime: readingTimeOf(content),
    html,
  };
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}
