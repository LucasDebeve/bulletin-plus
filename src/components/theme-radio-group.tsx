import { MenubarRadioGroup, MenubarRadioItem } from '@/components/ui/menubar';
import { useTheme } from '@/hooks/use-theme';
import { Moon, Sun, Settings } from 'lucide-react';

function ThemeRadioGroup() {
  const { setTheme } = useTheme();

  return (
    <MenubarRadioGroup value={useTheme().theme}>
      <MenubarRadioItem value={'system'} onClick={() => setTheme('system')}>
        <Settings />
        Mode du système
      </MenubarRadioItem>
      <MenubarRadioItem value="light" onClick={() => setTheme('light')}>
        <Sun />
        Mode clair
      </MenubarRadioItem>
      <MenubarRadioItem value="dark" onClick={() => setTheme('dark')}>
        <Moon />
        Mode sombre
      </MenubarRadioItem>
    </MenubarRadioGroup>
  );
}

export default ThemeRadioGroup;
