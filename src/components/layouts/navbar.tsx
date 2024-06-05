"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { signOut, useSession } from "next-auth/react";
import cx from "classnames";
import { usePathname } from "next/navigation";
import { MdOutlineAttachMoney, MdOutlineTrendingUp } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa6";
import { FiHelpCircle, FiUser, FiLogOut } from "react-icons/fi";
import { GlobalContext } from "@/context";
import { useContext } from "react";
const nav_links: { title: string; href: string; icon?: React.ReactElement }[] =
  [
    {
      title: "Contributions",
      href: "/",
      icon: <MdOutlineTrendingUp size={20} />,
    },
    {
      title: "Funding Sources",
      href: "/#",
      icon: <MdOutlineAttachMoney size={20} />,
    },
    {
      title: "Rollovers",
      href: "/#",
      icon: <FaRegCircle size={16} />,
    },
  ];
const settings_links: {
  title: string;
  href: string;
  icon?: React.ReactElement;
}[] = [
  {
    title: "Profile",
    href: "/#",
    icon: <FiUser size={20} />,
  },
  {
    title: "Help",
    href: "/#",
    icon: <FiHelpCircle size={20} />,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useContext(GlobalContext) || {};

  if (["/signin", "/signup", "/contributions/checkout"].includes(pathname!))
    return <></>;

  if (!user) return <></>;

  return (
    <>
      <aside className="w-[300px] bg-slate-200 h-[100vh] py-[24px] border-r-[2px] border-slate-300 ">
        <div className="flex items-center gap-[12px] mb-[64px] px-[16px]">
          <span className="min-w-[64px] w-[64px] block h-[64px] bg-slate-500 rounded-[12px]"></span>

          <div className="flex flex-col">
            <span className="text-lg text-slate-900">Boricua Capital</span>
            <span className="text-base text-slate-500">
              {user!.email.length > 20
                ? user!.email.slice(0, 20) + "..."
                : user!.email}
            </span>
          </div>
        </div>
        <NavigationMenu orientation="vertical" className="sidebar-nav">
          <NavigationMenuList className="flex-col items-start px-[16px] w-full">
            {nav_links.map((item) => (
              <NavigationMenuItem
                key={item.title}
                className={cx(
                  "hover:bg-[#ffffff] rounded-[8px] !ml-0 w-full hover:shadow",
                  {
                    "bg-[#ffffff]": pathname === item.href,
                  }
                )}
              >
                <NavigationMenuLink
                  href={item.href}
                  className={cx(
                    navigationMenuTriggerStyle(),
                    "w-full hover:text-slate-900",
                    pathname === item.href ? "text-slate-900" : "text-slate-500"
                  )}
                >
                  <span className="w-[20px] flex items-center justify-center mr-[8px]">
                    {item.icon}
                  </span>

                  {item.title}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

            <hr
              className="border-slate-300 mx-[-16px] b-t-[2px]"
              style={{
                width: "calc(100% + 32px)",
                marginLeft: "-16px",
                borderTopWidth: "2px",
              }}
            />

            {settings_links.map((item) => (
              <NavigationMenuItem
                key={item.title}
                className={cx(
                  "hover:bg-[#ffffff] rounded-[8px] !ml-0 w-full hover:shadow",
                  {
                    "bg-[#ffffff]": pathname === item.href,
                  }
                )}
              >
                <NavigationMenuLink
                  href={item.href}
                  className={cx(
                    navigationMenuTriggerStyle(),
                    "navlink",
                    pathname === item.href
                      ? "text-slate-900 shadow"
                      : "text-slate-500"
                  )}
                >
                  <span className="w-[20px] flex items-center justify-center mr-[8px]">
                    {item.icon}
                  </span>

                  {item.title}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

            <NavigationMenuItem className="!ml-0 w-full hover:bg-[#ffffff] rounded-[8px] hover:shadow">
              <NavigationMenuLink
                onClick={() => signOut()}
                className={cx(navigationMenuTriggerStyle(), "navlink")}
              >
                <span className="w-[20px] flex items-center justify-center mr-[8px]">
                  <FiLogOut size={20} />
                </span>
                Logout
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </aside>
    </>
  );
}
