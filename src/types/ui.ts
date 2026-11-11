import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "accent";
export type ButtonSize = "small" | "medium" | "large";
export type Tone = "brand" | "accent" | "danger" | "info" | "neutral";
export type AvatarSize = "small" | "medium" | "large";

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleOptions {}

export interface ButtonLinkProps extends ButtonStyleOptions {
  href: string;
  children: ReactNode;
}

export interface ChildrenProps {
  children: ReactNode;
}

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export interface ProgressBarProps {
  value: number;
  total?: number;
  tone?: Tone;
  label: string;
  className?: string;
}

export interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

export interface AvatarProps {
  emoji: string;
  size?: AvatarSize;
  className?: string;
}

export interface StatTileProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: Tone;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children?: ReactNode;
}

export interface NoticeProps {
  children: ReactNode;
  tone?: Tone;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface NavLinkProps {
  href: string;
  label: string;
  layout: "sidebar" | "tabbar";
  /** Icon rendered by the server parent, since components cannot cross the client boundary. */
  children: ReactNode;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface AppShellProps {
  children: ReactNode;
  topBar?: ReactNode;
}
