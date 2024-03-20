'use client';

import { createTheme } from '@mantine/core';
import { invoke } from '@tauri-apps/api/core';

export const theme = createTheme({
    scale: 1,
  /* Put your mantine theme override here */
});

export async function getTheme() {
    const scale: number = await invoke('get_scale');

    return createTheme({
        scale,
    });
}
