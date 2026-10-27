import type {
  AdminUser,
  Category,
  ContactMessage,
  Media,
  Post,
  Product,
  Setting,
  Subscriber,
  Session,
} from "@prisma/client";

export type {
  AdminUser,
  Category,
  ContactMessage,
  Media,
  Post,
  Product,
  Session,
  Setting,
  Subscriber,
};

export type SiteSettings = Setting;

export type ProductWithCategory = Product & { category: Category | null };

export type ProductStatus = "DRAFT" | "PUBLISHED";
export type PostStatus = "DRAFT" | "PUBLISHED";

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface BreadcrumbEntry {
  name: string;
  href?: string;
}
