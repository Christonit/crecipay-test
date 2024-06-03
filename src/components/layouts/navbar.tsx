"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { signOut } from "next-auth/react";
import cx from "classnames";

const navLinks: { title: string; href: string }[] = [
  {
    title: "Contributions",
    href: "/#",
  },
  {
    title: "Funding Sources",
    href: "/#",
  },
  {
    title: "Rollovers",
    href: "/#",
  },
  {
    title: "Profile",
    href: "/#",
  },
  {
    title: "Help",
    href: "/#",
  },
];

export default function Navbar() {
  return (
    <aside className="w-[300px] bg-slate-300 h-[100vh] py-[24px] px-[16px]">
      <div className="flex items-center gap-[12px] mb-[64px]">
        <span className="w-[64px] h-[64px] bg-slate-200 rounded-[12px]"></span>

        <div className="flex flex-col">
          <span className="text-lg text-slate-900">Boricua Capital</span>
          <span className="text-base text-slate-600">Ramon Cacho</span>
        </div>
      </div>
      <NavigationMenu orientation="vertical">
        <NavigationMenuList className="flex-col items-start">
          {navLinks.map((item) => (
            <NavigationMenuItem key={item.title} className="!ml-0">
              <NavigationMenuLink
                href={item.href}
                className={navigationMenuTriggerStyle()}
              >
                {item.title}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}

          <NavigationMenuItem className="!ml-0">
            <NavigationMenuLink
              onClick={() => signOut()}
              className={navigationMenuTriggerStyle()}
            >
              Logout
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </aside>
  );
}
