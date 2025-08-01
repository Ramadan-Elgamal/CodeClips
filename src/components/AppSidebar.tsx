
'use client';

import { 
    Sidebar, 
    SidebarContent, 
    SidebarFooter, 
    SidebarHeader, 
    SidebarMenu, 
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { 
    Home, 
    GraduationCap, 
    Bookmark, 
    Upload, 
    FileText, 
    LogOut, 
    PlaySquare,
    LogIn,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from './ui/skeleton';

export function AppSidebar() {
    const pathname = usePathname();
    const { user, loading, logout } = useAuth();
    const isActive = (path: string) => pathname === path;

    return (
        <Sidebar>
            <SidebarHeader>
                 <Link href="/" className="flex items-center gap-2.5">
                    <PlaySquare className="h-7 w-7 text-primary" />
                    <span 
                        className="text-xl font-bold font-headline transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0"
                    >
                      CodeClips
                    </span>
                  </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/')}>
                           <Link href="/">
                            <Home />
                            <span>Home</span>
                           </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/paths')}>
                            <Link href="/paths">
                                <GraduationCap />
                                <span>Learning Paths</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                   {user && (
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/saved')}>
                            <Link href="/saved">
                                <Bookmark />
                                <span>Saved Projects</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                   )}
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/submit')}>
                            <Link href="/submit">
                                <Upload />
                                <span>Submit Tutorial</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                         <SidebarMenuButton asChild isActive={isActive('/about')}>
                            <Link href="/about">
                                <FileText />
                                <span>About</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <SidebarSeparator />
                 <SidebarGroup>
                    {loading ? (
                        <div className="flex items-center gap-2 p-2">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="flex flex-col gap-y-1 overflow-hidden transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                    ) : user ? (
                         <>
                            <div className="flex items-center gap-2 p-2">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ""} />
                                    <AvatarFallback>{user.displayName?.[0] ?? user.email?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col overflow-hidden transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0">
                                    <p className="font-medium text-sm truncate">{user.displayName ?? 'User'}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                </div>
                            </div>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton onClick={logout} variant="ghost">
                                        <LogOut />
                                        <span>Logout</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                         </>
                    ) : (
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild variant="default">
                                    <Link href="/login">
                                        <LogIn />
                                        <span>Login</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    )}
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    );
}
