import { createStyles, useMantineTheme, Header as MHeader, Menu, Group, Center, Burger, Container, Image, Text, MediaQuery, Paper, Stack, ThemeIcon, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBus, IconChevronDown } from '@tabler/icons';
import { useRouter } from 'next/router';
import { motion } from "framer-motion"
import { useEffect } from 'react';
import { interactive } from './styles';
import { Logo } from './brand';

const useStyles = createStyles((theme) => ({
    header: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        borderBottom: 0,
    },

    inner: {
        height: 56,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    links: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    burger: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: '8px 12px',
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: theme.white,
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.fn.lighten(
                theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background!,
                0.1
            ),
        },
    },

    linkLabel: {
        marginRight: 5,
    },
}));

interface HeaderSearchProps {
    links: { link: string; label: string; links?: { link: string; label: string }[] }[];
}

export function Header({ links }: HeaderSearchProps) {
    const [opened, { toggle }] = useDisclosure(false);
    const { classes } = useStyles();
    const router = useRouter()
    const theme = useMantineTheme()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.documentElement.style.overflow = opened ? 'hidden' : 'initial'
        }
    }, [opened])

    const items = (burger?: boolean) => links.map((link) => {
        const openAction = (event: any, url: string) => { event.preventDefault(); router.push(url); if (burger) toggle() }

        const menuItems = link.links?.map((item) => (
            <Menu.Item key={item.link}>{item.label}</Menu.Item>
        ));

        if (menuItems) {
            return (
                <Menu key={link.label} trigger="hover" exitTransitionDuration={0}>
                    <Menu.Target>
                        <a
                            href={link.link}
                            className={classes.link}
                            onClick={(event) => openAction(event, link.link)}
                        >
                            <Center>
                                <Text size={burger ? "xl" : "sm"} className={classes.linkLabel}>{link.label}</Text>
                                <IconChevronDown size={12} stroke={1.5} />
                            </Center>
                        </a>
                    </Menu.Target>
                    <Menu.Dropdown>{menuItems}</Menu.Dropdown>
                </Menu>
            );
        }

        return (
            <a
                key={link.label}
                href={link.link}
                className={classes.link}
                onClick={(event) => openAction(event, link.link)}
            >
                <Text size={burger ? "xl" : "sm"}>
                    {link.label}
                </Text>
            </a>
        );
    });

    return (<div style={{ overflow: 'hidden' }}>
        <motion.div transition={{ ease: "easeInOut", duration: .2 }} style={{ position: 'absolute', bottom: 0, left: 0, overflow: 'hidden' }} animate={{ y: 56, height: opened ? '100vh' : 0 }} initial={{ y: '100%', height: '100%' }}>
            <MediaQuery styles={{ display: 'none' }} largerThan="sm">
                <Paper sx={{ width: '100vw', height: '100vh', zIndex: 1 }}>
                    <Stack p="md" spacing="sm">
                        {items(true)}
                    </Stack>
                </Paper>
            </MediaQuery>
        </motion.div>
        <MHeader sx={{ '& *': { zIndex: 2 } }} height={56} className={classes.header} mb={120}>
            <Container>
                <div className={classes.inner}>
                    <Group sx={{ cursor: 'pointer' }} onClick={() => router.push("/")} spacing='xs' noWrap>
                        <Logo size={40} />
                        <MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
                            <Text size={22} weight={550}>Menetrendek.info</Text>
                        </MediaQuery>
                    </Group>
                    <Group spacing={5} className={classes.links}>
                        {items()}
                    </Group>
                    {!links.length ? <></> :
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            className={classes.burger}
                            size="sm"
                            color="#fff"
                        />
                    }
                </div>
            </Container>
        </MHeader>
    </div>);
}