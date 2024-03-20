'use client';

import {
    Button,
    Center,
    Group,
    MantineColorScheme,
    NumberInput,
    Select,
    Stack,
    Switch,
    Table,
    Text,
    useCombobox,
    useMantineColorScheme,
} from '@mantine/core';
import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Config } from '@/model/Config';
import { theme } from '@/theme';

export default function RandomPicker() {
    const { setColorScheme } = useMantineColorScheme();
    const [config, setConfig] = useState({
        color: 'auto',
        number: {
            min: 0,
            max: 100,
            select_type: 'None',
        },
    } as Config);
    const [files, setFiles] = useState<[string, number][]>([]);
    const [number, setNumber] = useState(1);
    const [random, setRandom] = useState<[any]>([] as unknown as [any]);
    const [showAnswer, setShowAnswer] = useState(false);

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const [current, setCurrent] = useState<string | null>(null);

    async function updateConfig() {
        const configStr: string = await invoke('get_config');
        const configStruct: Config = JSON.parse(configStr);
        setConfig(configStruct);
        setColorScheme(configStruct.color as MantineColorScheme);
        theme.scale = configStruct.scale;
    }

    async function updateFileIndex() {
        const res: string = await invoke('get_lists');
        const result: [string, number][] = JSON.parse(res);
        setFiles(result);
    }

    useState(() => {
        updateConfig()
            .then(() => {
            });
        updateFileIndex()
            .then(() => {
            });
    });

    const rows = random.map((item, index) => (
        <Table.Tr key={index}>
            {current === null && <Table.Th>{item}</Table.Th>}
            {current !== null && config.number.select_type === 'None' &&
                <>
                    <Table.Th>{item[1]}</Table.Th>
                    { showAnswer && <Table.Th>{item[2]}</Table.Th> }
                </>}
            {current !== null && config.number.select_type !== 'None' &&
                <>
                    <Table.Th>{item[0]}</Table.Th>
                    <Table.Th>{item[1]}</Table.Th>
                    { showAnswer && <Table.Th>{item[2]}</Table.Th> }
                </>}
        </Table.Tr>
    ));

    function generate() {
        invoke('generate', {
            name: current,
            numGenerates: number,
            minNumber: config.number.min,
            maxNumber: config.number.max,
            generateMode: config.number.select_type,
        })
            .then((returnedResult) => {
                const result: [any] = JSON.parse(returnedResult as string);
                setRandom(result);
            });
    }

    function onNumberChange(e: string | number) {
        setNumber(e as number);
        setRandom([] as unknown as [any]);
    }

    function onCurrentUpdate(e: string | null) {
        setCurrent(e);
        setRandom([] as unknown as [any]);
    }

    return (
        <Center>
            <Stack>
                <Group justify="center">
                    <Group>
                        <Select
                          placeholder="选择词汇表"
                          data={files.map((item) => item[0])}
                          value={current}
                          onChange={(value) => onCurrentUpdate(value)}
                          clearable
                        />
                    </Group>

                    <Text>生成个数</Text>
                    <NumberInput placeholder="生成个数" value={number} onChange={onNumberChange} min={1} />
                </Group>
                <Group justify="center">
                    <Button onClick={generate}>生成</Button>
                    <Button
                      variant="subtle"
                      color="red"
                      onClick={() => {
                        setRandom([] as unknown as [any]);
                        setCurrent(null);
                    }}
                    >重置
                    </Button>
                    <Group>
                        显示释义
                        <Switch
                          checked={showAnswer}
                          onChange={(value) => { setShowAnswer(value.target.checked); }}
                        />
                    </Group>
                </Group>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            {current === null && <Table.Td>学号</Table.Td>}
                            {current !== null && config.number.select_type === 'None' &&
                                <>
                                    <Table.Td>单词</Table.Td>
                                    { showAnswer && <Table.Td>释义</Table.Td> }
                                </>}
                            {current !== null && config.number.select_type !== 'None' &&
                                <>
                                    <Table.Td>学号</Table.Td>
                                    <Table.Td>单词</Table.Td>
                                    { showAnswer && <Table.Td>释义</Table.Td> }
                                </>}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {rows}
                    </Table.Tbody>
                </Table>
                {/*{JSON.stringify(config)}*/}
                {/*{JSON.stringify(random)}*/}
            </Stack>
        </Center>
    );
}
