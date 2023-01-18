import { IconHeart } from '@tabler/icons';
import { Card, Image, Text, Group, Badge, Button, ActionIcon, createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },

    section: {
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
            }`,
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        paddingBottom: theme.spacing.md,
    },

    like: {
        color: theme.colors.red[6],
    },

    label: {
        textTransform: 'uppercase',
        fontSize: theme.fontSizes.xs,
        fontWeight: 700,
    },
}));

interface CityCardProps {
    image?: string;
    title: string;
    county: string;
    description: string;
}

export function CityCard({ image, title, description, county }: CityCardProps) {
    const { classes, theme } = useStyles();

    return (
        <Card withBorder radius="md" p="md" className={classes.card}>
            <Card.Section>
                <Image src={image} alt={title} height={180} />
            </Card.Section>

            <Card.Section className={classes.section} mt="md">
                <Group noWrap position="apart">
                    <Text size="lg" weight={500}>
                        {title}
                    </Text>
                    <Badge size="sm">{county}</Badge>
                </Group>
                <Text size="sm" mt="xs">
                    {description}
                </Text>
            </Card.Section>
        </Card>
    );
}