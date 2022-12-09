import { createStyles } from "@mantine/core";

export const dynamicShade = (theme: any) => theme.colorScheme === "dark" ? theme.primaryShade - 1 : theme.primaryShade + 1
export const gradientText = (theme: any) => ({ background: theme.fn.gradient({ from: theme.colors[theme.primaryColor][dynamicShade(theme)], to: theme.colors["blue"][dynamicShade(theme)] }), WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', })
export const interactive = (theme: any) => ({ transition: '.2s', cursor: 'pointer', '& * .img-wrapper img': { 'transition': '.3s ease-in-out' }, '&:hover *': { color: theme.colors[theme.primaryColor][Number(theme.primaryShade)], '& .img-wrapper img': { 'transform': 'scale(1.1)' } }, '&:focus': { border: `1px solid ${theme.colors[theme.primaryColor][theme.primaryShade]}` } })

export const useMyAccordion = createStyles((theme) => ({
    root: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        borderRadius: theme.radius.sm,
    },

    item: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        border: '1px solid transparent',
        position: 'relative',
        zIndex: 0,
        transition: 'transform 150ms ease',

        '&[data-active]': {
            transform: 'scale(1.03)',
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            boxShadow: theme.shadows.md,
            borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],
            borderRadius: theme.radius.md,
            zIndex: 1,
        },
    },

    chevron: {
        display: 'none'
    },
}));