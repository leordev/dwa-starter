import { useNavigate, useLocation } from "react-router-dom";
import { HouseIcon, LogInIcon, SettingsIcon, LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Sidebar = ({ className }: SidebarProps) => {
  return (
    <nav
      className={cn(
        "pb-12 flex flex-col justify-between md:min-h-full",
        className
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            My DWA
          </h2>
          <div className="space-y-1">
            <SidebarMenuItem icon={HouseIcon} label="Home" path="/" />
            <SidebarMenuItem
              icon={SettingsIcon}
              label="Settings"
              path="/settings"
            />
          </div>
        </div>
      </div>
      <div className="px-3 pt-2">
        <Button variant="ghost" className="w-full justify-between">
          Connect
          <LogInIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
};

interface SidebarMenuItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
}

const SidebarMenuItem = ({ icon: Icon, label, path }: SidebarMenuItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;
  const variant = isActive ? "secondary" : "ghost";

  return (
    <Button
      variant={variant}
      className="w-full justify-start"
      onClick={() => navigate(path)}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
};
