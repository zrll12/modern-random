'use client';

import { AppShell, Button, Group } from '@mantine/core';
import { useRouter } from 'next/navigation';
import {useState} from "react";

export function AppNavbar({ children }: { children: any }) {
    const [current, setCurrent] = useState('/');
    const router = useRouter();
    return (
        <>
            <AppShell header={{ height: 60 }} padding="md">
                <AppShell.Header>
                    <Group h="100%" px="md">
                        <Button
                            variant={current === '/' ? 'filled' : 'subtle'}
                            onClick={() => { setCurrent('/'); router.push('/'); }}>生成</Button>
                        <Button
                            variant={current === '/data' ? 'filled' : 'subtle'}
                            onClick={() => { setCurrent('/data'); router.push('/data'); }}>数据</Button>
                    </Group>
                </AppShell.Header>

                <AppShell.Main>
                    {children}
                </AppShell.Main>
            </AppShell>
        </>
    );
}
