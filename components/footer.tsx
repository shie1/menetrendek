import { createStyles, Text, Container, ActionIcon, Group, Image } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram } from '@tabler/icons';
import { useRouter } from 'next/router';
import { Logo } from './brand';
import { LocalizedStrings } from '../pages/api/localization';

const useStyles = createStyles((theme) => ({
    footer: {
        paddingTop: theme.spacing.xl * 2,
        paddingBottom: theme.spacing.xl * 2,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
            }`,
    },

    logo: {
        maxWidth: 200,

        [theme.fn.smallerThan('sm')]: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
    },

    description: {
        marginTop: 5,

        [theme.fn.smallerThan('sm')]: {
            marginTop: theme.spacing.xs,
            textAlign: 'center',
        },
    },

    inner: {
        display: 'flex',
        justifyContent: 'space-between',

        [theme.fn.smallerThan('sm')]: {
            flexDirection: 'column',
            alignItems: 'center',
        },
    },

    groups: {
        display: 'flex',
        flexWrap: 'wrap',

        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    wrapper: {
        width: 160,
    },

    link: {
        display: 'block',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
        fontSize: theme.fontSizes.sm,
        paddingTop: 3,
        paddingBottom: 3,

        '&:hover': {
            textDecoration: 'underline',
        },
    },

    title: {
        fontSize: theme.fontSizes.lg,
        fontWeight: 700,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        marginBottom: theme.spacing.xs / 2,
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },

    afterFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
            }`,

        [theme.fn.smallerThan('sm')]: {
            flexDirection: 'column',
        },
    },

    social: {
        [theme.fn.smallerThan('sm')]: {
            marginTop: theme.spacing.xs,
        },
    },
}));

interface FooterLinksProps {
    data: {
        title: string;
        links: { label: string; link: string }[];
    }[];
}

export function Footer({ data, strings }: FooterLinksProps & { strings: LocalizedStrings }) {
    const { classes } = useStyles();
    const router = useRouter()

    const groups = data.map((group) => {
        const links = group.links.map((link, index) => (
            <Text
                key={index}
                className={classes.link}
                component="a"
                rel="noreferrer"
                href={link.link}
                onClick={(event) => {
                    event.preventDefault();
                    if (link.link.search(location.origin) === -1) {
                        window.open(link.link, "_blank")
                    } else {
                        router.push(link.link)
                    }
                }}
            >
                {link.label}
            </Text >
        ));

        return (
            <div className={classes.wrapper} key={group.title}>
                <Text className={classes.title}>{group.title}</Text>
                {links}
            </div>
        );
    });

    if (router.pathname === "/map") { return <></> }

    return (
        <footer role="contentinfo" className={classes.footer} style={{ marginTop: router.pathname === "/map" ? 0 : 120 }}>
            <Container className={classes.inner}>
                <div className={classes.logo}>
                    <Logo size={30} />
                    <Text weight={30} size="xs" color="dimmed" className={classes.description}>
                        Menetrendek <br /> {strings.slogan}
                    </Text>
                </div>
                <div className={classes.groups}>{groups}</div>
            </Container>
            <Container className={classes.afterFooter}>
                <Text color="dimmed" size="sm">
                    &copy; {(new Date()).getFullYear()} Shie1bi
                </Text>

                <Group spacing={0} className={classes.social} position="right" noWrap>
                    <Text color="dimmed" size="sm">
                        shibibence@gmail.com
                    </Text>
                </Group>
            </Container>
        </footer>
    );
}