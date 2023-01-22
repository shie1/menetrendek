import { forwardRef, useCallback, useContext, useEffect, useState } from "react";
import { Input, MenuHandler } from "../pages/_app";
import { MdTram } from "react-icons/md"
import { Autocomplete, Box, Group, ScrollArea, SelectItemProps, Text, Loader, ActionIcon, Menu } from "@mantine/core/";
import { IconMapPin, IconBus, IconTrain, IconEqual, IconShip, IconQuestionMark, IconArrowBarRight, IconArrowBarToRight, IconClearAll, IconDots, IconRefresh, IconX } from "@tabler/icons";
import { apiCall } from "./api";
import { useLocalStorage } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { isEqual } from "lodash";

export interface Stop {
    value?: string
    network?: number;
    id: number;
}

const Dropdown = ({ children, ...props }: any) => {
    return (<ScrollArea
        sx={{
            maxHeight: '25vh',
            width: '100%',
        }}>
        {children}
    </ScrollArea>)
}

export const StopIcon = ({ network, size, ...props }: { network: number, size?: number }) => {
    props = { ...props, size: size ? size : 24 }
    switch (network) {
        case 0: // City
            return <IconMapPin {...props} />
        case 1: // Bus station
        case 10: // Bus stop (A)
        case 24: // Bus stop (B)
        case 25: // Train replacement
            return <IconBus {...props} />
        case 2: // Train station (A)
            return <IconTrain {...props} />
        case 14: // Metro
            const style: any = { position: 'absolute' }
            return <Box sx={{ overflow: 'hidden', width: (props as any).size, height: (props as any).size, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconEqual style={style} {...props} size={(props as any).size * 10} />
                <IconTrain style={style} {...props} size={(props as any).size} />
            </Box>
        case 3:
            return <IconShip {...props} />
        case 12: // Tram
        case 13: // Trolley
            return <MdTram {...props} />
        default:
            return <IconQuestionMark {...props} />
    }
}


const AutoCompleteItem = forwardRef<HTMLDivElement, SelectItemProps & Stop>(
    ({ value, network, id, ...others }: SelectItemProps & Stop, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap align="left">
                <div style={{ zIndex: '99 !important' }}>
                    <StopIcon network={network!} />
                </div>
                <div>
                    <Text sx={{ wordWrap: 'break-word', whitespace: 'pre-wrap' }}>{value}</Text>
                </div>
            </Group>
        </div >
    )
);

export const StopInput = ({ variant }: { variant: "from" | "to" }) => {
    const [data, setData] = useState<Array<Stop & any>>([])
    const [stops, setStops] = useLocalStorage<Array<Stop>>({ key: 'frequent-stops', defaultValue: [] })
    const i = useContext(Input)
    const [selected, setSelected] = [i.selection[variant], ((e: Stop | undefined) => { i.setSelection({ ...i.selection, [variant]: e }) })]
    const [input, setInput] = [i.input[variant], ((e: string) => { i.setInput({ ...i.input, [variant]: e }) })]
    const [loading, setLoading] = useState(false)
    const { menuOpen, setMenuOpen } = useContext(MenuHandler)

    useEffect(() => {
        if (stops.length) {
            if ((stops[0] as any).s_id) {
                setStops([])
                showNotification({ title: 'Megállóidat töröltük!', message: 'A gyakori megállók listája nem kompatibilis a jelenlegi verzióval. A lista törlésre került.', color: 'yellow', icon: <IconClearAll />, id: 'error-cleared-stops' })
            }
        }
    }, [stops])

    useEffect(() => {
        const delay = 1000
        let bounce: any
        if (input) {
            setLoading(true)
            bounce = setTimeout(() => { apiCall("POST", "/api/autocomplete", { input: input }).then((e) => { setData(e.map((e: any) => ({ ...e, value: e.stop_name }))) }).finally(() => setLoading(false)) }, delay)
        } else {
            setData([])
        }
        return () => clearTimeout(bounce)
    }, [input])

    const swap = useCallback(() => {
        const s = i.selection
        const inp = i.input
        i.setSelection({ from: s.to, to: s.from })
        i.setInput({ from: inp.to, to: inp.from })
    }, [i])

    return (<Autocomplete
        icon={selected ? <StopIcon network={selected.network as number} /> : loading ? <Loader size="sm" /> : (variant == 'from' ? <IconArrowBarRight /> : <IconArrowBarToRight />)}
        placeholder={variant == 'from' ? 'Honnan?' : 'Hova?'}
        data={input.length ? data.filter((item, i, array) => array.findIndex((e) => e.value === item.value) === i) : stops}
        switchDirectionOnFlip={false}
        filter={() => true}
        value={selected?.value || input}
        dropdownComponent={Dropdown}
        onChange={(e) => { setSelected(undefined); setInput(e) }}
        onItemSubmit={(e: any) => { setStops([{ value: e.value, id: e.id, network: e.network }, ...stops.filter(item => !isEqual(item, { value: e.value, id: e.id, network: e.network }))]); setSelected(e); setInput(e.value) }}
        styles={(theme) => ({
            dropdown: {
                background: '#1A1B1E',
                borderRadius: theme.radius.md
            }
        })}
        size="md"
        sx={(theme) => ({ borderBottom: `2px solid ${theme.colors.gray[8]}` })}
        itemComponent={AutoCompleteItem}
        variant="unstyled"
        rightSection={typeof selected === 'undefined' && input.length === 0 ? <></> :
            <Menu transition="scale-y" transitionDuration={200} onClose={() => setMenuOpen(-1)} onOpen={() => setMenuOpen(variant === "from" ? 0 : 1)} opened={variant === "from" ? menuOpen === 0 : menuOpen === 1} position="bottom-end" styles={(theme) => ({ dropdown: { minWidth: '15rem', background: theme.colors.dark[7], borderRadius: theme.radius.md } })}>
                <Menu.Target>
                    <ActionIcon variant="transparent">
                        <IconDots />
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown role="menu">
                    <Menu.Label>{variant === 'from' ? "Honnan?" : "Hova?"}</Menu.Label>
                    <Menu.Item role="menuitem" onClick={() => {
                        setInput("")
                        setSelected(undefined)
                    }} color="red" icon={<IconX />}>
                        Mező törlése
                    </Menu.Item>
                    <Menu.Divider role="separator" />
                    <Menu.Label>Összes mező</Menu.Label>
                    <Menu.Item role="menuitem" onClick={swap} icon={<IconRefresh />}>
                        Mezők felcserélése
                    </Menu.Item>
                    <Menu.Item role="menuitem" onClick={() => {
                        i.setInput({ from: "", to: "" })
                        i.setSelection({ from: undefined, to: undefined })
                    }} color="red" icon={<IconClearAll />}>
                        Mezők törlése
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>}
    />)
}