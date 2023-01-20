import { Stack, Group, Title, ThemeIcon, useMantineTheme } from "@mantine/core";
import { TablerIcon } from "@tabler/icons";
import { Logo } from "./brand";
import { createElement } from "react";

export const PageHeading = ({ icon, title, subtitle }: { icon: TablerIcon, title: string, subtitle?: string }) => {
    const theme = useMantineTheme()
    return (<Stack spacing={0}>
        <Group spacing="sm" align="center">
            <ThemeIcon size={65} sx={{ borderRadius: "100%" }} variant="gradient" gradient={{ from: theme.colors[theme.primaryColor][theme.primaryShade as any], to: theme.colors["cyan"][theme.primaryShade as any] }}>
                {createElement(icon, { size: 65 / 7 * 5.5, stroke: 1.5 })}
            </ThemeIcon>
            <Title size={50}>{title}</Title>
        </Group>
        <Title weight={600} color={"dimmed"} order={2}>{subtitle}</Title>
    </Stack>)
}