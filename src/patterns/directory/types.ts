export type DirectoryImage = {
  alt: string;
  fallback?: string;
  src?: string;
};

export type BusinessStatus = {
  label: string;
  tone?: "danger" | "neutral" | "success" | "warning";
};

export type BusinessSummary = {
  category: string;
  description?: string;
  href: string;
  id: string;
  image?: DirectoryImage;
  location: string;
  name: string;
  rating?: number;
  reviewCount?: number;
  status?: BusinessStatus;
  tags?: readonly string[];
  verified?: boolean;
};

export type BusinessHour = {
  closed?: boolean;
  day: string;
  hours?: string;
};

export type BusinessPromotion = {
  description?: string;
  eyebrow?: string;
  href?: string;
  id: string;
  title: string;
};

export type DirectoryFilter = {
  count?: number;
  disabled?: boolean;
  label: string;
  value: string;
};

export type DirectoryCategory = {
  icon?: ReactNode;
  label: string;
  value: string;
};

export type DirectorySearchValue = {
  location: string;
  query: string;
};
import type { ReactNode } from "react";
