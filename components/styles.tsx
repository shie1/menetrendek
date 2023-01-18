import { createStyles } from "@mantine/core";

export const dynamicShade = (theme: any) => theme.colorScheme === "dark" ? theme.primaryShade - 1 : theme.primaryShade + 1
export const gradientText = (theme: any) => ({ background: theme.fn.gradient({ from: theme.colors[theme.primaryColor][dynamicShade(theme)], to: theme.colors["blue"][dynamicShade(theme)] }), WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', })
export const interactive = (theme: any) => ({ transition: '.2s', cursor: 'pointer', '& * .img-wrapper img': { 'transition': '.3s ease-in-out' }, '&:hover *': { color: theme.colors[theme.primaryColor][Number(theme.primaryShade)], '& .img-wrapper img': { 'transform': 'scale(1.1)' } }, '&:focus': { border: `1px solid ${theme.colors[theme.primaryColor][theme.primaryShade]}` } })