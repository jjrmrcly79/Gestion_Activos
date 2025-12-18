'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  Scale,
  Activity,
  Database,
  Users,
  Settings,
  Menu,
  ClipboardList,
  ShieldAlert,
  Package
} from 'lucide-react';
import { useState } from 'react';
import GoogleTranslate from '../ui/GoogleTranslate';

const iamGroups = [
  {
    title: 'Strategy & Planning',
    icon: Map,
    href: '/strategy',
    color: 'text-blue-500',
    description: 'Group 1: IAM Strategy'
  },
  {
    title: 'Decision Making',
    icon: Scale,
    href: '/decisions',
    color: 'text-purple-500',
    description: 'Group 2: IAM Decisions'
  },
  {
    title: 'Lifecycle Execution',
    icon: Activity,
    href: '/lifecycle',
    color: 'text-green-500',
    description: 'Group 3: IAM Lifecycle'
  },
  {
    title: 'Asset Information',
    icon: Database,
    href: '/assets',
    color: 'text-orange-500',
    description: 'Group 4: IAM Information'
  },
  {
    title: 'Organization',
    icon: Users,
    href: '/organization',
    color: 'text-pink-500',
    description: 'Group 5: IAM Organization'
  },
  {
    title: 'Work Management',
    icon: ClipboardList,
    href: '/work-orders',
    color: 'text-indigo-500',
    description: 'Maintenance Work Orders'
  },
  {
    title: 'Warehouse',
    icon: Package,
    href: '/warehouse',
    color: 'text-amber-500',
    description: 'Inventory & Kits'
  },
  {
    title: 'Risk & Review',
    icon: ShieldAlert,
    href: '/risk',
    color: 'text-red-500',
    description: 'Group 6: IAM Risk'
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className={`h-screen bg-[hsl(var(--card))] border-r border-[hsl(var(--card-border))] flex flex-col transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} print:hidden`}>
      <div className="p-4 border-b border-[hsl(var(--card-border))] flex items-center justify-between">
        {isOpen && <h1 className="font-bold text-xl tracking-tight text-[hsl(var(--primary))]">ISO 55000</h1>}
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-[hsl(var(--muted))] rounded-md transition-colors">
          <Menu className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          <li>
            <Link
              href="/"
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${pathname === '/' ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]'}`}
            >
              <LayoutDashboard className="h-5 w-5" />
              {isOpen && <span>Dashboard</span>}
            </Link>
          </li>

          <li className="my-2 border-t border-[hsl(var(--card-border))]" />

          {iamGroups.map((group) => {
            const isActive = pathname.startsWith(group.href);
            return (
              <li key={group.href}>
                <Link
                  href={group.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors group relative ${isActive ? 'bg-[hsl(var(--muted))] font-medium' : 'hover:bg-[hsl(var(--muted))]'}`}
                >
                  <group.icon className={`h-5 w-5 ${group.color}`} />
                  {isOpen ? (
                    <span className="text-sm">{group.title}</span>
                  ) : (
                    <></>
                  )}
                  {/* Tooltip for collapsed state could go here */}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-[hsl(var(--card-border))] space-y-2">
        {isOpen && <GoogleTranslate />}
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[hsl(var(--muted))] transition-colors text-[hsl(var(--muted-foreground))]">
          <Settings className="h-5 w-5" />
          {isOpen && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}
