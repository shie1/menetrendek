import { createStyles } from "@mantine/core";

export const dynamicShade = (theme: any) => theme.colorScheme === "dark" ? theme.primaryShade - 1 : theme.primaryShade + 1
export const gradientText = (theme: any) => ({ background: theme.fn.gradient({ from: theme.colors[theme.primaryColor][dynamicShade(theme)], to: theme.colors["blue"][dynamicShade(theme)] }), WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', })
export const interactive = (theme: any) => ({ transition: '.2s', cursor: 'pointer', '& * .img-wrapper img': { 'transition': '.3s ease-in-out' }, '&:hover *': { color: theme.colors[theme.primaryColor][Number(theme.primaryShade)], '& .img-wrapper img': { 'transform': 'scale(1.1)' } }, '&:focus': { border: `1px solid ${theme.colors[theme.primaryColor][theme.primaryShade]}` } })


export const useMyAccordion = createStyles((theme) => ({
    root: {
        borderRadius: theme.radius.md,
    },

    control: {
        '&:hover': {
            background: 'unset'
        }
    },

    item: {
        backgroundColor: theme.fn.rgba(theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0], .9),
        border: '1px solid transparent',
        position: 'relative',
        zIndex: 0,
        transition: 'transform 150ms ease',
        borderRadius: theme.radius.lg,

        '&[data-active]': {
            transform: 'scale(1.03)',
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            boxShadow: theme.shadows.md,
            borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],
            borderRadius: theme.radius.lg,
            zIndex: 1,
        },
    },

    chevron: {
        display: 'none'
    },
}));