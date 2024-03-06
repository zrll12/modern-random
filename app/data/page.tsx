'use client';

import {
    Button, CloseButton,
    Divider,
    Group,
    MantineColorScheme, Modal, NumberInput,
    RangeSlider, ScrollArea,
    SegmentedControl,
    Stack, Switch, Table,
    useMantineColorScheme,
} from '@mantine/core';
import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useDisclosure } from '@mantine/hooks';
import { Config } from '@/model/Config';
import ImportWords from '@/components/ImportWords/ImportWords';

export default function DataPage() {
    const { colorScheme, setColorScheme } = useMantineColorScheme();
    const [checked, setChecked] = useState(false);
    const [modify, setModify] = useState(false);
    const [importOpened, importMovement] = useDisclosure(false);
    const [files, setFiles] = useState<[string, number][]>([]);

    const rows = files.map((element) => (
        <Table.Tr key={element[0]}>
            <Table.Td>{element[0]}</Table.Td>
            <Table.Td>{element[1]}</Table.Td>
            <Table.Td><CloseButton /></Table.Td>
        </Table.Tr>
    ));

    const sliderMarks = [
        { value: 20, label: '20' },
        { value: 40, label: '40' },
        { value: 60, label: '60' },
        { value: 80, label: '80' },
    ];

    const [config, setConfig] = useState({
        color: 'auto',
        number: {
            min: 0,
            max: 100,
            select_type: 'None',
        },
        words: [],
    } as Config);

    async function updateNumberConfig() {
        const configStr: string = await invoke('get_config');
        const configStruct: Config = JSON.parse(configStr);
        setConfig(configStruct);
    }

    async function updateFileIndex() {
        const res: string = await invoke('get_lists');
        const result: [string, number][] = JSON.parse(res);
        setFiles(result);
    }

    async function saveConfig() {
        await invoke('set_config', { config: JSON.stringify(config) })
            .then(() => {
                setModify(false);
            });
    }

    function onNumberChange(value: number[]) {
        setModify(true);
        setConfig((c) => {
            const [min, max] = value;

            return {
                color: c.color,
                number: {
                    min,
                    max,
                    select_type: c.number.select_type,
                },
            };
        });
    }

    function onNumberSelectChange(value: string) {
        setModify(true);
        setConfig((c) => ({
            color: c.color,
            number: {
                min: c.number.min,
                max: c.number.max,
                select_type: value,
            },
        }));
    }

    function onNumberMinChange(value: string | number) {
        setModify(true);
        setConfig((c) => ({
                color: c.color,
                number: {
                    min: value as number,
                    max: c.number.max,
                    select_type: c.number.select_type,
                },
            }));
    }

    function onNumberMaxChange(value: string | number) {
        setModify(true);
        setConfig((c) => ({
                color: c.color,
                number: {
                    min: c.number.min,
                    max: value as number,
                    select_type: c.number.select_type,
                },
            }));
    }

    function handleColorSchemeChange(value: string) {
        setColorScheme(value as MantineColorScheme);
        setConfig((c) => ({
            color: value,
            number: c.number,
        }));
        setModify(true);
    }

    function handleFinishCreateFile() {
        updateFileIndex().then(() => {});
        importMovement.close();
    }

    useState(async () => {
        updateNumberConfig()
             .then(() => {});
        updateFileIndex()
             .then(() => {});
    });

    return (
        <Stack>
            <ScrollArea h={410}>
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
                          maw={400}
                        />
                    </Group>
                    <Group>
                        <NumberInput
                          placeholder="min"
                          value={config.number.min}
                          onChange={onNumberMinChange}
                          min={0}
                          max={config.number.max - 10}
                        />
                        -
                        <NumberInput
                          placeholder="max"
                          value={config.number.max}
                          onChange={onNumberMaxChange}
                          min={config.number.min + 10}
                          max={100}
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
                    <Group>
                        <Modal opened={importOpened} onClose={importMovement.close} title="导入">
                            <ImportWords onClose={handleFinishCreateFile} />
                        </Modal>

                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>词汇表名</Table.Th>
                                    <Table.Th>词汇数目</Table.Th>
                                    <Table.Th />
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {rows}
                            </Table.Tbody>
                        </Table>
                        <Button onClick={importMovement.open}>导入单词表</Button>
                    </Group>
                </Stack>

                <Stack>
                    <h3>外观</h3>
                    <Group>
                        颜色模式
                        <SegmentedControl
                          data={[
                                { value: 'light', label: '浅色' },
                                { value: 'dark', label: '深色' },
                                { value: 'auto', label: '自动' },
                            ]}
                          value={colorScheme}
                          onChange={handleColorSchemeChange}
                        />
                    </Group>

                    <Group>
                        调试模式
                        <Switch
                          checked={checked}
                          onChange={(value) => { setChecked(value.target.checked); }}
                        />
                    </Group>

                </Stack>
            </ScrollArea>

            <Divider />

            <Group justify="flex-end">
                { checked ? JSON.stringify(config) : ''}

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
