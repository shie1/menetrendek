import { ThemeIcon, useMantineTheme } from "@mantine/core";
import { IconBus } from "@tabler/icons";

export const Logo = ({ size }: { size: number }) => {
    const theme = useMantineTheme()

    return (<ThemeIcon radius="xl" variant="gradient" gradient={{ from: theme.colors[theme.primaryColor][theme.primaryShade as any], to: theme.colors["cyan"][theme.primaryShade as any] }} size={size}>
        <IconBus size={size / 6 * 4} />
    </ThemeIcon>)
}