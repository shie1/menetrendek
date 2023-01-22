import { Stack, Group, Title, ThemeIcon, useMantineTheme } from "@mantine/core";
import { TablerIcon } from "@tabler/icons";
import { Logo } from "./brand";
import { createElement } from "react";

export const PageHeading = ({ icon, title, subtitle }: { icon?: TablerIcon, title: string, subtitle?: string }) => {
    const theme = useMantineTheme()
    return (<Stack spacing={0}>
        <Group spacing="sm" align="center">
            {!icon ? <></> :
                <ThemeIcon mb={-6} size={65} sx={{ borderRadius: "100%" }} variant="gradient" gradient={{ from: theme.colors[theme.primaryColor][theme.primaryShade as any], to: theme.colors["cyan"][theme.primaryShade as any] }}>
                    {createElement(icon, { size: 65 / 7 * 5.5, stroke: 1.5 })}
                </ThemeIcon>}
            <Title size={50}>{title}</Title>
        </Group>
        <Title weight={600} color={"dimmed"} order={2}>{subtitle}</Title>
    </Stack>)
}

export const PageSection = ({ icon, title, subtitle }: { icon?: TablerIcon, title: string, subtitle?: string }) => {
    const theme = useMantineTheme()
    return (<Stack sx={(theme) => ({ borderLeft: `2px solid ${theme.colors.gray[7]}` })} pl="sm" spacing={0}>
        <Group spacing="sm" align="center">
            {!icon ? <></> :
                <ThemeIcon mb={-6} size={40} sx={{ borderRadius: "100%" }} variant="gradient" gradient={{ from: theme.colors[theme.primaryColor][theme.primaryShade as any], to: theme.colors["cyan"][theme.primaryShade as any] }}>
                    {createElement(icon, { size: 40 / 7 * 5.5, stroke: 1.5 })}
                </ThemeIcon>}
            <Title order={2} size={36}>{title}</Title>
        </Group>
        <Title size="1.15rem" weight={600} color={"dimmed"} order={3}>{subtitle}</Title>
    </Stack>)
}