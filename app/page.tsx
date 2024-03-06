'use client';

import {MantineColorScheme, useMantineColorScheme} from '@mantine/core';
import {ColorSchemeToggle} from "@/components/ColorSchemeToggle/ColorSchemeToggle";
import {Welcome} from "@/components/Welcome/Welcome";
import {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/core";

export default function HomePage() {
    const { setColorScheme } = useMantineColorScheme();

    useEffect(() => {
        let color = invoke("get_color").then((color) => {
            console.log(color);
            setColorScheme(color as MantineColorScheme);
        });
    });

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