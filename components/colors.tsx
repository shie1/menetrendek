import { useMantineTheme } from "@mantine/core"

const useColors = () => {
    const theme = useMantineTheme()
    return { warning: theme.colorScheme === "dark" ? "#ffc400" : "#b05b04" }
}

export default useColors