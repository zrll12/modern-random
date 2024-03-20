'use client';

import {
    Button, CloseButton,
    Divider,
    Group,
    MantineColorScheme, Modal, NumberInput, Popover,
    RangeSlider, ScrollArea,
    SegmentedControl,
    Stack, Switch, Table, Text,
    useMantineColorScheme,
} from '@mantine/core';
import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Config } from '@/model/Config';
import ImportWords from '@/components/ImportWords/ImportWords';

export default function DataPage() {
    const { colorScheme, setColorScheme } = useMantineColorScheme();
    const [checked, setChecked] = useState(false);
    const [modify, setModify] = useState(false);
    const [importOpened, importMovement] = useDisclosure(false);
    const [files, setFiles] = useState<[string, number][]>([]);
    const [baseDir, setBaseDir] = useState('' as string);
    const [restartNotify, setRestartNotify] = useState(false);

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
    } as Config);

    async function updateNumberConfig() {
        const configStr: string = await invoke('get_config');
        const configStruct: Config = JSON.parse(configStr);
        setConfig(configStruct);
        setColorScheme(configStruct.color as MantineColorScheme);
    }

    async function updateFileIndex() {
        const res: string = await invoke('get_lists');
        const result: [string, number][] = JSON.parse(res);
        setFiles(result);
    }

    async function saveConfig() {
        await invoke('set_config', { config: JSON.stringify(config) })
            .then(() => {
                notifications.show({ title: '保存成功', message: '配置已保存', color: 'teal', withBorder: true });
                setModify(false);
            }).catch((reason: string) => {
                notifications.show({ title: '保存失败', message: reason, color: 'red', withBorder: true });
            });
        if (restartNotify) {
            notifications.show({ title: '需要重新启动', message: '您所作的更改需要重新启动应用', color: 'yellow', withBorder: true });
            setRestartNotify(false);
        }
    }

    function onNumberChange(value: number[]) {
        setModify(true);
        setConfig((c) => {
            const [min, max] = value;

            return {
                color: c.color,
                scale: c.scale,
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
            scale: c.scale,
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
                scale: c.scale,
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
                scale: c.scale,
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
            scale: c.scale,
            number: c.number,
        }));
        setModify(true);
    }

    function handleScaleChange(value: string | number) {
        setConfig((c) => ({
            color: c.color,
            scale: value as number,
            number: c.number,
        }));
        setModify(true);
        setRestartNotify(true);
    }

    function handleFinishCreateFile() {
        updateFileIndex().then(() => {
            notifications.show({ title: '导入成功', message: '词汇表已导入', color: 'teal', withBorder: true });
        }).catch((reason: string) => {
            notifications.show({ title: '导入失败', message: reason, color: 'red', withBorder: true });
        });
        importMovement.close();
    }

    const rows = files.map((element) => (
        <Table.Tr key={element[0]}>
            <Table.Td>{element[0]}</Table.Td>
            <Table.Td>{element[1] / 1024 / 1024 > 1 ?
                `${(element[1] / 1024 / 1024).toFixed(3)} MB` :
                `${(element[1] / 1024).toFixed(3)} KB`}
            </Table.Td>
            <Table.Td>
                <Popover width={200} position="bottom" withArrow shadow="md">
                    <Popover.Target>
                        <CloseButton />
                    </Popover.Target>
                    <Popover.Dropdown>
                        <Stack gap="xs">
                            <Text>确定要删除吗</Text>
                            <Text size="xs">文件将立即删除且无法恢复</Text>
                            <Button
                              size="xs"
                              fullWidth
                              color="red"
                              onClick={() => {
                                invoke('remove_list', { name: element[0] })
                                    .then(() => {
                                        updateFileIndex().then(() => {
                                            notifications.show({ title: '删除成功', message: '词汇表已删除', color: 'teal', withBorder: true });
                                        });
                                    });
                            }}
                            >删除
                            </Button>
                        </Stack>
                    </Popover.Dropdown>
                </Popover>
            </Table.Td>
        </Table.Tr>
    ));

    useState(async () => {
        updateNumberConfig()
             .then(() => {});
        updateFileIndex()
             .then(() => {});
        invoke('get_base_dir')
            .then((value) => { setBaseDir(value as string); });
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
                                { value: 'None', label: '不抽取', disabled: files.length === 0 },
                                { value: 'One', label: '抽取一名', disabled: files.length === 0 },
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
                                    <Table.Th>词汇表大小</Table.Th>
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
                        放大大小
                        <NumberInput
                          value={config.scale}
                          onChange={handleScaleChange}
                          placeholder="放大大小"
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

                { checked ?
                    <Stack>
                        <h3>调试信息</h3>
                        <Text>{JSON.stringify(config)}</Text>
                        <Text>{baseDir}</Text>
                    </Stack> : <></>}
            </ScrollArea>

            <Divider />

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
