'use client';

import { Button, Divider, Group, RangeSlider, SegmentedControl, Stack } from '@mantine/core';
import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Config } from '@/model/Config';

export default function DataPage() {
    const sliderMarks = [
        { value: 20, label: '20' },
        { value: 40, label: '40' },
        { value: 60, label: '60' },
        { value: 80, label: '80' },
    ];

    const [config, setConfig] = useState({
        number: {
            min: 0,
            max: 100,
            select_type: 'None',
        },
        words: [],
        color: 'auto',
    } as Config);
    const [modify, setModify] = useState(false);

    async function updateNumberConfig() {
        const configStr: string = await invoke('get_config');
        const configStruct: Config = JSON.parse(configStr);
        setConfig(configStruct);
    }

    function onNumberChange(value: number[]) {
        setModify(true);
        setConfig((c) => {
            const [min, max] = value;

            return {
                number: {
                    min,
                    max,
                    select_type: c.number.select_type,
                },
                words: c.words,
                color: c.color,
            };
        });
    }

    function onNumberSelectChange(value: string) {
        setModify(true);
        setConfig((c) => ({
            number: {
                min: c.number.min,
                max: c.number.max,
                select_type: value,
            },
            words: c.words,
            color: c.color,
        }));
    }

    async function saveConfig() {
        await invoke('set_config', { config: JSON.stringify(config) })
            .then(() => {
                setModify(false);
            });
    }

    useState(async () => {
        await updateNumberConfig();
    });

    return (
        <Stack>
            <Stack justify="center" gap="lg">
                <h3>学号</h3>
                <Group>
                    学号范围
                    <RangeSlider
                      marks={sliderMarks}
                      miw={400}
                      value={config === {} as Config ?
                          [0, 100] : [config.number.min, config.number.max]}
                      onChange={onNumberChange}
                    />
                </Group>
                <Group>
                    抽取学号
                    <SegmentedControl
                      data={[
                            { value: 'None', label: '不抽取' },
                            { value: 'One', label: '抽取一名' },
                            { value: 'Same', label: '同单词抽取数量' },
                        ]}
                      value={config.number.select_type}
                      onChange={onNumberSelectChange}
                    />
                </Group>
            </Stack>

            <Stack>
                <h3>单词</h3>
            </Stack>

            <Divider />

            {JSON.stringify(config)}

            <Group justify="flex-end">
                <Button
                  color="red"
                  variant="light"
                  onClick={() => {
                        updateNumberConfig()
                            .then(() => {
                                setModify(false);
                            });
                    }}
                  disabled={!modify}
                >取消
                </Button>
                <Button disabled={!modify} onClick={saveConfig}>保存</Button>
            </Group>
        </Stack>
    );
}
