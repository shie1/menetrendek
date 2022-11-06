import { createStyles, Select, MultiSelect, Stack, ActionIcon, ColorInput, useMantineTheme, ColorSwatch, Group, Paper, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconX, IconRotateClockwise } from "@tabler/icons";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

const useRoundInputStyles = createStyles((theme) => ({
    root: {
        position: 'relative',
    },

    input: {
        height: 'auto',
        paddingTop: theme.spacing.lg,
    },

    label: {
        position: 'absolute',
        pointerEvents: 'none',
        fontSize: theme.fontSizes.xs,
        paddingLeft: theme.spacing.sm,
        paddingTop: theme.spacing.sm / 2,
        zIndex: 1,
    },

    values: {
        marginTop: theme.spacing.xs / 4,
    }
}));

export const DiscountSelector = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['discount-percentage']);
    const { classes } = useRoundInputStyles()

    return (<Select
        data={[{ value: '0', label: 'Nincs' }, { value: '50', label: '50%' }, { value: '90', label: '90%' }, { value: '100', label: 'Díjmentes' }]}
        value={(cookies['discount-percentage'] || "0").toString()}
        onChange={(e) => setCookie("discount-percentage", Number(e), { path: '/', maxAge: 60 * 60 * 24 * 365 })}
        label="Kedvezmény típusa"
        radius='lg'
        classNames={classes}
    />)
}

export const NetworksSelector = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['selected-networks']);
    const { classes } = useRoundInputStyles()

    useEffect(() => {
        if (!cookies["selected-networks"]) {
            setCookie("selected-networks", ['1', '2', '25', '3', '10', '24', '13', '12', '11', '14'], { path: '/', maxAge: 60 * 60 * 24 * 365 })
        }
    }, [cookies])

    return (<MultiSelect
        data={[
            { label: 'Helyközi autóbusz', value: '1', 'group': 'Busz' },
            { label: 'Vonat', value: '2', group: 'Vonat' },
            { label: 'Vonatpótló', value: '25', group: 'Busz' },
            { label: 'Hajó', value: '3', group: 'Egyéb' },
            { label: 'Helyi és kijáró autóbusz', value: '10,24', group: 'Busz' },
            { label: 'Helyiérdekű vasút', value: '13', group: 'Vonat' },
            { label: 'Villamos', value: '12', group: 'Egyéb' },
            { label: 'Trolibusz', value: '11', group: 'Busz' },
            { label: 'Metró', value: '14', group: 'Egyéb' }
        ]}
        onChange={(val) => {
            setCookie("selected-networks", val.reduce(function (acc: any, curr) {
                acc.push(...curr.split(','))
                return acc;
            }, []), { path: '/', maxAge: 60 * 60 * 24 * 365 })
        }
        }
        value={cookies["selected-networks"] ? cookies["selected-networks"].map((item: string) => {
            if (item == "10") { return '10,24' }
            if (item == "24") { return }
            return item
        }) : ['1', '2', '25', '3', '10,24', '13', '12', '11', '14']}
        rightSection={<Stack spacing={4}>
            <ActionIcon onClick={() => {
                setCookie("selected-networks", [], { path: '/', maxAge: 60 * 60 * 24 * 365 })
            }} size='sm'>
                <IconX />
            </ActionIcon>
            <ActionIcon onClick={() => {
                setCookie("selected-networks", ['1', '2', '25', '3', '10', '24', '13', '12', '11', '14'], { path: '/', maxAge: 60 * 60 * 24 * 365 })
            }} size='sm'>
                <IconRotateClockwise />
            </ActionIcon>
        </Stack>}
        label="Közlekedés"
        radius='lg'
        classNames={classes}
    />)
}