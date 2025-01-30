//Convert social links into a Array formate
//Only Map links which icons exits
import {
  FacebookLogo,
  GlobeSimple,
  Icon,
  InstagramLogo,
  LinkedinLogo,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

function parseSocialLinks(socialLinks: Record<string, string>) {
  const socialIcons: Record<string, Icon> = {
    youtube: YoutubeLogo,
    facebook: FacebookLogo,
    instagram: InstagramLogo,
    twitter: XLogo,
    website: GlobeSimple,
    linkedin: LinkedinLogo,
  };
  const links: Array<{ key: string; Icon: Icon; url: string }> = [];
  for (const key in socialLinks) {
    const url = socialLinks[key];
    if (socialIcons[key] && url) {
      links.push({ key, Icon: socialIcons[key], url });
    }
  }
  return links;
}

export function SocialLinks({
  links,
  className,
}: {
  links: Record<string, string>;
  className?: string;
}) {
  const linksArr = parseSocialLinks(links);

  return (
    !!linksArr.length && (
      <ul
        aria-label="Social media links"
        className={twMerge("flex flex-wrap items-center gap-1", className)}
      >
        {linksArr.map(({ Icon, key, url }) => (
          <li key={key}>
            <Link
              to={url}
              title={`User ${key}`}
              target="_blank"
              className="inline-block rounded-full p-1.5 text-blue-500/90 transition-all duration-300 hover:bg-slate-200 dark:text-neutral-200 dark:hover:bg-neutral-900"
            >
              <Icon size={24} />
            </Link>
          </li>
        ))}
      </ul>
    )
  );
}
