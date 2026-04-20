import type { FC } from "react";
import { LogOutIcon } from "lucide-react";

import type { User } from "@/types/entities";

import { getNameInitials } from "@/helpers/string";

import { logout } from "@/states/oauth";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const UserMenu: FC<{ profile: User }> = ({ profile }) => {
  const name = profile.oauth_name ?? "Account";
  const email = profile.oauth_email;
  const picture = profile.oauth_picture;
  const initials = getNameInitials(name);

  return (
    <div className="p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex w-full items-center gap-2 rounded-md p-2 text-left transition-colors hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
            aria-label="Open account menu"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={picture}
                alt={name}
                referrerPolicy="no-referrer"
              />
              <AvatarFallback className="bg-emerald-100 text-xs text-emerald-700">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-stone-900">
                {name}
              </p>
              {email && (
                <p className="truncate text-xs text-muted-foreground">
                  {email}
                </p>
              )}
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" side="top" className="w-52">
          <DropdownMenuLabel className="font-normal">
            <p className="truncate text-sm font-medium text-stone-900">
              {name}
            </p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => logout()}
            className="text-red-600 focus:bg-red-50 focus:text-red-700"
          >
            <LogOutIcon
              size={16}
              className="mr-2 stroke-red-600 focus:stroke-red-700"
            />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
