
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
    SidebarGroupLabel,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarSeparator,
    useSidebar,
} from '@/components/ui/sidebar';
import { 
    Home, 
    GraduationCap, 
    Bookmark, 
    Upload, 
    FileText, 
    Github, 
    Contact,
    LogOut, 
    PlaySquare
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

export function AppSidebar() {
    const pathname = usePathname();
    const { state } = useSidebar();
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
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/saved')}>
                            <Link href="/saved">
                                <Bookmark />
                                <span>Saved Projects</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
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
                    <div className="flex items-center gap-2 p-2">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col overflow-hidden transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0">
                            <p className="font-medium text-sm truncate">Guest</p>
                            <p className="text-xs text-muted-foreground truncate">guest@example.com</p>
                        </div>
                    </div>
                    <SidebarMenu>
                         <SidebarMenuItem>
                            <SidebarMenuButton asChild variant="ghost">
                                <Link href="/login">
                                    <LogOut />
                                    <span>Logout</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarSeparator />
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild variant="ghost">
                            <a href="https://github.com" target="_blank">
                                <Github />
                                <span>GitHub</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild variant="ghost" isActive={isActive('/terms')}>
                             <Link href="/terms">
                                <FileText />
                                <span>Terms & Privacy</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild variant="ghost" isActive={isActive('/contact')}>
                             <Link href="/contact">
                                <Contact />
                                <span>Contact</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
