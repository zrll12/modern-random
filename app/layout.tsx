import '@mantine/core/styles.css';
import React from 'react';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { theme } from '@/theme';
import { AppNavbar } from '@/components/AppNavbar/AppNavbar';
import './global.css';
import '@mantine/notifications/styles.css';
import {Notifications} from "@mantine/notifications";

export const metadata = {
    title: 'Mantine Next.js template',
    description: 'I am using Mantine with Next.js!',
};

export default function RootLayout({ children }: { children: any }) {
    return (
        <html lang="en">
        <head>
            <ColorSchemeScript />
            <link rel="shortcut icon" href="/favicon.svg" />
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
            />
        </head>
        <body>
        <MantineProvider theme={theme}>
            <Notifications position={"top-right"} w={300}/>
            <AppNavbar>{children}</AppNavbar>
        </MantineProvider>
        </body>
        </html>
    );
}
