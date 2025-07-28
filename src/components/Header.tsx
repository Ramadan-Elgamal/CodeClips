
'use client';

import Link from 'next/link';
import { PlaySquare, Bookmark, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinks = (
    <>
      <Button variant="ghost" asChild>
        <Link href="/saved" onClick={isMobile ? closeMobileMenu : undefined}>
          <Bookmark className="mr-2 h-4 w-4" />
          Saved
        </Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/login" onClick={isMobile ? closeMobileMenu : undefined}>Login</Link>
      </Button>
      <Button asChild>
        <Link href="/signup" onClick={isMobile ? closeMobileMenu : undefined}>Sign Up</Link>
      </Button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <PlaySquare className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline sm:inline-block">
              CodeClips
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isMobile ? (
             <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col items-start space-y-4 pt-8">
                  {navLinks}
                </nav>
              </SheetContent>
            </Sheet>
          ) : (
            <nav className="flex items-center space-x-1">
              {navLinks}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
