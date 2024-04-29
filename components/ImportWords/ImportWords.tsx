import {
    Button,
    Chip,
    Divider,
    FileButton,
    Group,
    Input,
    ScrollArea,
    Stack, Textarea,
} from '@mantine/core';
import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { notifications } from '@mantine/notifications';

export default function ImportWords(props: ImportWordsProps) {
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState('json');

    function updateName(value: any) {
        setName(value.target.value);
    }

    function updateContent(value: any) {
        const valueStr = value.currentTarget.value;
        setContent(valueStr.replace('“', '"')
            .replace('”', '"'));
    }

    function uploadFile(value: File | null) {
        if (!value) return;
        if (value.type.includes('json')) {
            setType('json');
        } else if (value.type.includes('csv')) {
            setType('csv');
        } else {
            notifications.show({ title: '文件类型错误', message: '文件似乎并不是json和csv文件，请自行确认内容正确性', color: 'yellow' });
        }
        value.text()
            .then((texts) => {
                setContent(texts);
            });
    }

    async function saveWords() {
        const contentReplaced = content.replace('“', '"')
            .replace('”', '"');
        if (!name || !contentReplaced) {
            notifications.show({ title: '错误', message: '名称和内容不能为空', color: 'red' });
            return;
        }
        invoke(type === 'json' ? 'create_list_from_json' : 'create_list_from_csv', {
            name,
            list: contentReplaced,
        }).then(() => {
            props.onClose(true);
        }).catch((e: string) => {
            notifications.show({ title: '错误', message: e, color: 'red' });
        });
    }

    return (
        <Stack>
            <ScrollArea h={300}>
                <Stack>
                    <Input.Wrapper label="词汇表名称">
                        <Input placeholder="名称" value={name} onChange={updateName} />
                    </Input.Wrapper>
                    <Chip.Group value={type} onChange={setType} multiple={false}>
                        <Group justify="center">
                            <Chip value="json">json</Chip>
                            <Chip value="csv">csv</Chip>
                        </Group>
                    </Chip.Group>
                    <Textarea
                      label="词汇表内容"
                      placeholder="请将 词汇表内容 粘贴在此处"
                      autosize
                      minRows={4}
                      value={content}
                      onChange={updateContent}
                    />
                    <Group justify="center">
                        <FileButton onChange={uploadFile} accept="application/json">
                            {(fileProps) => <Button {...fileProps} fullWidth>上传文件导入</Button>}
                        </FileButton>
                    </Group>
                </Stack>
            </ScrollArea>

            <Divider />

            <Group>
                <Button
                  color="red"
                  variant="light"
                  onClick={() => { props.onClose(false); }}
                >取消
                </Button>
                <Button onClick={saveWords}>保存</Button>
            </Group>
        </Stack>
    );
}

export interface ImportWordsProps {
    onClose: (changed: boolean) => void;
}
