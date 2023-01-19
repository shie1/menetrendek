import { IconHeart } from '@tabler/icons';
import { Card, Image, Text, Group, Badge, Button, ActionIcon, createStyles, Box } from '@mantine/core';
import { interactive } from './styles';
import Link from 'next/link';

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        '& img': {
            transition: ".2s"
        },
        '&:hover img': {
            transform: "scale(1.05)"
        }
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
    id: number;
    title: string;
    county: { id: number, name: string };
    description: string;
}

export function CityCard({ image, title, description, county, id }: CityCardProps) {
    const { classes, theme } = useStyles();

    const ck = Object.keys(theme.colors).filter((e) => !["dark", "gray"].includes(e))
    const colors = Array(19).fill(0).map((e, i) => ck[i % ck.length])

    return (
        <Link href={`/${title.toLowerCase()}`}>
            <Card sx={{ cursor: 'pointer', }} radius="md" p="md" className={classes.card}>
                <Card.Section>
                    <Box sx={{ height: 180, overflow: 'hidden' }}>
                        <Image src={image} alt={title} height={180} />
                    </Box>
                </Card.Section>

                <Card.Section className={classes.section} mt="md">
                    <Group noWrap position="apart">
                        <Text size="lg" weight={500}>
                            {title}
                        </Text>
                        <Badge color={colors[county.id]} size="sm">{county.name}</Badge>
                    </Group>
                    <Text size="sm" mt="xs">
                        {description}
                    </Text>
                </Card.Section>
            </Card>
        </Link>
    );
}