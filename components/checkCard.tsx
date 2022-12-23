import { UnstyledButton, Checkbox, Text, createStyles, Space } from '@mantine/core';
import { useUncontrolled } from '@mantine/hooks';
import { createElement } from "react"

const useStyles = createStyles((theme) => ({
    button: {
        display: 'flex',
        width: '100%',
        border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[3]
            }`,
        borderRadius: theme.radius.md,
        padding: theme.spacing.lg,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0],
        },
    },
}));

interface CheckboxCardProps {
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?(checked: boolean): void;
    title: React.ReactNode;
}

export function CheckboxCard({
    checked,
    defaultChecked,
    onChange,
    title,
    children,
    ...others
}: CheckboxCardProps & { title: React.ReactNode; children: any }) {
    const { classes, cx } = useStyles();

    const [value, handleChange] = useUncontrolled({
        value: checked,
        defaultValue: defaultChecked,
        finalValue: false,
        onChange,
    });

    return (
        <div
            {...others}
            className={classes.button}
            style={{ position: 'relative' }}
        >
            <div>
                <Checkbox
                    checked={value}
                    tabIndex={-1}
                    onChange={() => handleChange(!value)}
                    size="md"
                    styles={{ input: { cursor: 'pointer' } }}
                />
            </div>
            <Space w={20} />
            <div style={{ width: '100%' }}>
                <Text weight={500} mb={7} sx={{ lineHeight: 1 }}>
                    {title}
                </Text>
                <Text size="sm" color="dimmed">
                    {children}
                </Text>
            </div>
        </div>
    );
}

export function ContentCard({
    title,
    children,
    icon,
    ...others
}: { title: React.ReactNode; icon: any; children: any }) {
    const { classes, cx } = useStyles();

    return (
        <div
            {...others}
            className={classes.button}
        >
            {createElement(icon, { size: 24 })}
            <Space w={20} />
            <div style={{ width: '100%' }}>
                <Text weight={500} mb={7} sx={{ lineHeight: 1 }}>
                    {title}
                </Text>
                <Text size="sm" color="dimmed">
                    {children}
                </Text>
            </div>
        </div>
    );
}