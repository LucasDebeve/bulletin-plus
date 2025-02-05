import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import ThemeRadioGroup from '@/components/theme-radio-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LoginForm from '@/components/layout/LoginForm.tsx';
import { useState } from 'react';

function Header({
  setDataToLocalStorage,
}: {
  setDataToLocalStorage: () => void;
}) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={'fixed top-2 left-2 right-2 z-10 max-w-[1280px] mx-auto'}>
      <Dialog open={open} onOpenChange={setOpen}>
        <Menubar
          className={
            'flex items-center px-4 shadow-lg rounded-md h-10 print:hidden'
          }
        >
          <span className={'text-md font-semibold ml-2 mr-4 my-3'}>
            Bulletin <span className="text-xl">+</span>
          </span>
          <MenubarMenu>
            <MenubarTrigger>Accueil</MenubarTrigger>
            <MenubarContent className={'print:hidden'}>
              <MenubarItem onClick={setDataToLocalStorage}>
                Sauvegarder
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Partager</MenubarItem>
              <MenubarItem onClick={handlePrint}>Imprimer</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Affichage</MenubarTrigger>
            <MenubarContent>
              <ThemeRadioGroup />
            </MenubarContent>
          </MenubarMenu>
          <div className="flex-1" />
          <MenubarMenu>
            <MenubarTrigger className={'ml-auto'}>
              <Avatar size={'sm'}>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>&#9829;</AvatarFallback>
              </Avatar>
            </MenubarTrigger>
            <MenubarContent>
              <DialogTrigger asChild>
                <MenubarItem>Se connecter</MenubarItem>
              </DialogTrigger>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <LoginForm handleClose={handleClose} />
      </Dialog>
    </div>
  );
}

export default Header;
