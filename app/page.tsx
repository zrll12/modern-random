'use client';

import { Tabs } from '@mantine/core';
import {ColorSchemeToggle} from "@/components/ColorSchemeToggle/ColorSchemeToggle";
import {Welcome} from "@/components/Welcome/Welcome";

export default function HomePage() {
    // @ts-ignore
    return (
        <>
            <Welcome />
            <ColorSchemeToggle />
            {/*<Tabs>*/}
            {/*    <Tabs.List>*/}
            {/*        <Tabs.Tab value="123">Tab 1</Tabs.Tab>*/}
            {/*        <Tabs.Tab value="222">Tab 2</Tabs.Tab>*/}
            {/*        <Tabs.Tab value="333">Tab 3</Tabs.Tab>*/}
            {/*    </Tabs.List>*/}
            {/*</Tabs>*/}
            {/*<Welcome />*/}
            {/*<ColorSchemeToggle />*/}
        </>
    );
}
