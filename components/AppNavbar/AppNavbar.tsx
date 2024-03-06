'use client';

import { AppShell, Button, Group } from '@mantine/core';
import { useRouter } from 'next/navigation';

export function AppNavbar({ children }: { children: any }) {
    const router = useRouter();
    return (
        <>
            <AppShell header={{ height: 60 }} padding="md">
                <AppShell.Header>
                    <Group h="100%" px="md">
                        <Button variant="light" onClick={() => { router.push('/'); }}>生成</Button>
                        <Button variant="white" onClick={() => { router.push('/data'); }}>数据</Button>
                    </Group>
                </AppShell.Header>

                <AppShell.Main>
                    {children}
                </AppShell.Main>
            </AppShell>
        </>
    );
}
