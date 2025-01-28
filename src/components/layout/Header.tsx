import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar';
import ThemeRadioGroup from '@/components/theme-radio-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function Header() {
  return (
    <Menubar
      className={
        'position-absolute top-0 left-0 right-0 z-10 flex items-center px-4'
      }
    >
      <span className={'text-md font-semibold ml-2 mr-4'}>
        Bulletin <span className="text-xl">+</span>
      </span>
      <MenubarMenu>
        <MenubarTrigger>Accueil</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Partager</MenubarItem>
          <MenubarItem>Imprimer</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Modifier</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Ajouter une note <MenubarShortcut>Ctrl + N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>Supprimer une note</MenubarItem>
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
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Se connecter</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export default Header;
