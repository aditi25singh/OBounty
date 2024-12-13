"use client";

import { Link } from "@nextui-org/link";
import Image from "next/image";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { CollabLogo } from "@/components/collabIcon";
import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/listbox";

export default function Home() {
  return (
      <section className="flex flex-col items-center justify-center gap-6 py-10 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title()}>Empower your&nbsp;</span>
          <span className={title({ color: "violet" })}>code&nbsp;</span>
          <br></br>
          <span className={title()}>Earn your&nbsp;</span>
          <span className={title({ color: "blue" })}>reward.&nbsp;</span>
          <div className={subtitle({ class: "mt-4 italic" })}>
          Where open-source meets open-opportunities.
          </div>
        </div>
        <div className="flex w-2/4">
          < CollabLogo className=""/>
        </div>
        <div className="flex gap-3">
          <Link
            isExternal
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href={siteConfig.links.docs}
          >
            Get Started
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            GitHub
          </Link>
        </div>
      </section>
  );
}
