import type { FormHTMLAttributes, ReactNode } from "react";
import type {
  VorealNextImageComponent,
  VorealNextImageProps,
  VorealNextLinkComponent,
  VorealNextLinkProps,
} from "../../adapters";

export type {
  VorealNextImageComponent,
  VorealNextImageProps,
  VorealNextLinkComponent,
  VorealNextLinkProps,
} from "../../adapters";

export type NextDirectoryNavItem = {
  href: string;
  icon?: ReactNode;
  label: string;
};

export type NextDirectoryHeaderProps = {
  accountAvatarLabel?: string;
  accountLabel?: string;
  brand: ReactNode;
  descriptor?: string;
  LinkComponent?: VorealNextLinkComponent;
  navItems: readonly NextDirectoryNavItem[];
  primaryAction: NextDirectoryNavItem;
  theme?: string;
};

export type NextDirectorySearchValue = {
  query: string;
  location: string;
};

export type NextDirectorySearchFormProps = Omit<FormHTMLAttributes<HTMLFormElement>, "defaultValue" | "method"> & {
  action: string;
  defaultValue: NextDirectorySearchValue;
  /** Unique, valid HTML id stem for this form's query and location fields. */
  fieldIdPrefix: string;
  loading?: boolean;
  locationTrailingAction?: ReactNode;
  locationLabel?: string;
  queryTrailingAction?: ReactNode;
  queryLabel?: string;
  submitLabel?: string;
};

export type NextActiveFilter = {
  id: string;
  label: string;
};

export type NextDirectorySort = "relevance" | "rating" | "distance" | "newest";

export type NextDirectoryResultsHeaderProps = {
  activeFilters: readonly NextActiveFilter[];
  locationLabel: string;
  mobileFilterTrigger?: ReactNode;
  onClearAll?: () => void;
  onRemoveFilter?: (id: string) => void;
  onSortChange?: (value: NextDirectorySort) => void;
  queryLabel?: string;
  resultCount: number;
  sort: NextDirectorySort;
};

export type NextDirectoryFilterOption = {
  count?: number;
  disabled?: boolean;
  label: string;
  value: string;
};

export type NextDirectoryRadius = "5" | "10" | "25" | "50";

export type NextDirectoryFilterValue = {
  categories: readonly string[];
  languages: readonly string[];
  openNow: boolean;
  postalCode: string;
  radius: NextDirectoryRadius;
  verifiedOnly: boolean;
};

export type NextDirectoryFilterPanelProps = {
  categories: readonly NextDirectoryFilterOption[];
  languages: readonly NextDirectoryFilterOption[];
  onValueChange: (value: NextDirectoryFilterValue) => void;
  value: NextDirectoryFilterValue;
};

export type NextDirectoryFilterDrawerProps = NextDirectoryFilterPanelProps & {
  onApply?: () => void;
  onClear?: () => void;
  resultCount: number;
  theme?: string;
};

export type NextDirectoryImage = {
  alt: string;
  height: number;
  src: string;
  width: number;
};

export type NextBusinessStatus = {
  kind: "open" | "closing" | "closed";
  label: string;
};

export type NextDirectoryBusiness = {
  category: string;
  description?: string;
  distance?: string;
  href: string;
  id: string;
  image?: NextDirectoryImage;
  location: string;
  name: string;
  rating?: number;
  reviewCount?: number;
  status?: NextBusinessStatus;
  verified?: boolean;
};

export type NextDirectoryMediaProps = {
  ImageComponent?: VorealNextImageComponent;
  image?: NextDirectoryImage;
  name: string;
  sizes?: string;
};

export type NextDirectoryBusinessCardProps = {
  business: NextDirectoryBusiness;
  favoriteControl?: ReactNode;
  ImageComponent?: VorealNextImageComponent;
  LinkComponent?: VorealNextLinkComponent;
};
