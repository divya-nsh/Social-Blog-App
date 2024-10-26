//Convert social links into a Array formate
//Only Map links which icons exits
import {
  ArrowSquareOut,
  FacebookLogo,
  InstagramLogo,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { SocialLinksI } from "@/types/indext";

function parseSocialLinks(
  socialLinks: Record<string, string> | SocialLinksI,
  iconStyle: { size?: number; color?: string } = {},
) {
  const style = {
    size: iconStyle.size || 25,
  };
  const socialIcons: Record<string, ReactNode> = {
    youtube: <YoutubeLogo {...style} />,
    facebook: <FacebookLogo {...style} />,
    instagram: <InstagramLogo {...style} />,
    twitter: <XLogo {...style} />,
    website: <ArrowSquareOut {...style} />,
  };
  return Object.entries(socialLinks || {})
    .map(([key, value]) => ({ key, value, Icon: socialIcons[key] }))
    .filter(({ Icon, value }) => Icon && value.trim());
}

export function SocialLinks({
  links,
  className,
}: {
  links: Record<string, string> | SocialLinksI;
  className?: string;
}) {
  const linksArr = parseSocialLinks(links);

  return (
    !!linksArr.length && (
      <ul
        aria-label="Social media links"
        className={twMerge("flex flex-wrap items-center gap-1", className)}
      >
        {linksArr.map(({ Icon, key, value }) => (
          <li key={key}>
            <Link
              to={value}
              title={`User ${key}`}
              target="_blank"
              className="inline-block rounded-full px-1.5 py-1.5 text-blue-500/90 transition-all duration-300 hover:bg-slate-200 dark:text-blue-600 dark:hover:bg-neutral-900"
            >
              {Icon}
            </Link>
          </li>
        ))}
      </ul>
    )
  );
}
