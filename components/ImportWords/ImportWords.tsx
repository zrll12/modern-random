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
        if (!value.type.includes('json') && !value.type.includes('csv')) return;
        value.text()
            .then((texts) => {
                setContent(texts);
            });
    }

    async function saveWords() {
        const contentReplaced = content.replace('“', '"')
            .replace('”', '"');
        await invoke(type === 'json' ? 'create_list_from_json' : 'create_list_from_csv', {
            name,
            list: contentReplaced,
        });
        props.onClose();
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
                  onClick={props.onClose}
                >取消
                </Button>
                <Button onClick={saveWords}>保存</Button>
            </Group>
        </Stack>
    );
}

export interface ImportWordsProps {
    onClose: () => void;
}
