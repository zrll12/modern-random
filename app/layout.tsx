'use client';

import '@mantine/core/styles.css';
import React, { useEffect, useState } from 'react';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { getTheme, theme } from '@/theme';
import { AppNavbar } from '@/components/AppNavbar/AppNavbar';
import './global.css';
import '@mantine/notifications/styles.css';

// export const metadata = {
//     title: 'Mantine Next.js template',
//     description: 'I am using Mantine with Next.js!',
// };

export default function RootLayout({ children }: { children: any }) {
    const [tempTheme, setTheme] = useState(theme);

    useEffect(() => {
        getTheme().then((t) => setTheme(t));
    }, []);

    return (
        <html lang="en">
        <head>
            <ColorSchemeScript />
            <link rel="shortcut icon" href="/favicon.svg" />
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
            />
            <title>随机数生成器</title>
        </head>
        <body>
        <MantineProvider theme={tempTheme}>
            <Notifications position="top-right" w={300} />
            <AppNavbar>{children}</AppNavbar>
        </MantineProvider>
        </body>
        </html>
    );
}
