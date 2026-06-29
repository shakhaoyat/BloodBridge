import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import { Button, Drawer } from "@heroui/react";
import { Bars } from "@gravity-ui/icons";

import { ChartArea, User2, HeartHandshake, Users } from "lucide-react";

export default async function DashboardSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  const role = (user?.role || "donor").toLowerCase();

  const dashboardItems = {
    admin: [
      {
        icon: ChartArea,
        label: "Overview",
        link: "/dashboard/admin",
      },
      {
        icon: Users,
        label: "User Management",
        link: "/dashboard/admin/users",
      },
      {
        icon: HeartHandshake,
        label: "Donation Requests",
        link: "/dashboard/admin/donation-requests",
      },
    ],

    donor: [
      {
        icon: ChartArea,
        label: "Overview",
        link: "/dashboard/donor",
      },
      {
        icon: HeartHandshake,
        label: "Donation Requests",
        link: "/dashboard/donor/donation-requests",
      },
      {
        icon: User2,
        label: "My Profile",
        link: "/dashboard/profile",
      },
    ],

    volunteer: [
      {
        icon: ChartArea,
        label: "Overview",
        link: "/dashboard/volunteer",
      },
      {
        icon: HeartHandshake,
        label: "Manage Requests",
        link: "/dashboard/volunteer/donation-requests",
      },
      {
        icon: User2,
        label: "My Profile",
        link: "/dashboard/profile",
      },
    ],
  };

  const navItems = dashboardItems[role] || dashboardItems.donor;

  const SidebarItems = () => (
    <nav className="flex flex-col gap-2 mt-4">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.link}
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition hover:bg-default"
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 min-h-screen flex-col border-r bg-background">
        <div className="border-b p-4">
          <Link href="/" className="inline-block">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="BloodBridge Logo"
                width={180}
                height={50}
                className="h-12 w-auto"
              />
              <h1 className="text-xl font-bold"><span className="text-red-700">Blood</span>Bridge</h1>
            </div>
          </Link>
        </div>

        <SidebarItems />
      </aside>

      {/* Mobile Drawer */}
      <div className="lg:hidden p-3">
        <Drawer>
          <Drawer.Trigger>
            <Button isIconOnly variant="flat">
              <Bars />
            </Button>
          </Drawer.Trigger>

          <Drawer.Backdrop />

          <Drawer.Content placement="left">
            <Drawer.Dialog>
              <Drawer.CloseTrigger />

              <Drawer.Header>
                <Drawer.Heading>Dashboard</Drawer.Heading>
              </Drawer.Header>

              <Drawer.Body>
                <SidebarItems />
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer>
      </div>
    </>
  );
}