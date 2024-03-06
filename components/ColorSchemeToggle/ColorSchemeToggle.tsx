'use client';

import { Group, MantineColorScheme, SegmentedControl, useMantineColorScheme } from '@mantine/core';

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  function handleColorSchemeChange(value: string) {
    setColorScheme(value as MantineColorScheme);
  }

  return (
      <>
          <Group justify="center"><SegmentedControl
            data={[
                  { value: 'light', label: '浅色' },
                  { value: 'dark', label: '深色' },
                  { value: 'auto', label: '自动' },
              ]}
            value={colorScheme}
            onChange={handleColorSchemeChange}
          />
          </Group>
      </>
    // <Group justify="center" mt="xl">
    //   <Button onClick={() => setColorScheme('light')}>Light</Button>
    //   <Button onClick={() => setColorScheme('dark')}>Dark</Button>
    //   <Button onClick={() => setColorScheme('auto')}>Auto</Button>
    // </Group>
  );
}
