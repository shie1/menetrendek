import {
    createStyles,
    useMantineTheme,
    Header as MHeader,
    Menu,
    Group,
    Center,
    Burger,
    Container,
    Text,
    MediaQuery,
    Paper,
    Stack,
    Collapse,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Logo } from './brand';
import Link from "next/link"
import { LocalizedStrings } from '../pages/api/localization';

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

export function Header({ links, strings }: HeaderSearchProps & {strings: LocalizedStrings}) {
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
            <Menu.Item role="link" aria-label={item.label} key={item.link}>{item.label}</Menu.Item>
        ));

        if (menuItems) {
            return (
                <Menu key={link.label} trigger="hover" exitTransitionDuration={0}>
                    <Menu.Target>
                        <a
                            role="link"
                            aria-label={link.label}
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
                role="link"
                aria-label={link.label}
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
        <Collapse in={opened}>
            <MediaQuery styles={{ display: 'none' }} largerThan="sm">
                <Paper sx={{ width: '100vw' }}>
                    <Stack role="navigation" p="md" spacing="sm">
                        {items(true)}
                    </Stack>
                </Paper>
            </MediaQuery>
        </Collapse>
        <MHeader role="banner" sx={{ '& *': { zIndex: 2 } }} height={56} className={classes.header} mb={router.pathname === "/map" ? 0 : 120}>
            <Container>
                <div className={classes.inner}>
                    <Link href='/' role="link" aria-label={strings.homepage}>
                        <Group spacing='xs' noWrap style={{ cursor: 'pointer' }}>
                            <Logo size={40} />
                            <MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
                                <Text size={22} weight={550}>Menetrendek.info</Text>
                            </MediaQuery>
                        </Group>
                    </Link>
                    <Group role="navigation" spacing={5} className={classes.links}>
                        {items()}
                    </Group>
                    {!links.length ? <></> :
                        <Burger
                            opened={opened}
                            onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' } as any), toggle() }}
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