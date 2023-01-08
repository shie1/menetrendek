import { Autocomplete, ScrollArea, Group, Text, Box, ActionIcon, Menu, Transition } from "@mantine/core"
import { SelectItemProps } from "@mantine/core/lib/Select";
import { useLocalStorage } from "@mantine/hooks";
import { IconMapPin, IconBus, IconTrain, IconQuestionMark, IconArrowBarRight, IconArrowBarToRight, IconShip, IconEqual, IconX, IconDots, IconRefresh, IconClearAll } from "@tabler/icons";
import { isEqual } from "lodash";
import { CSSProperties, forwardRef, useEffect, useRef, useState } from "react"
import { useCookies } from "react-cookie";
import { apiCall } from "./api";
import { MdTram } from "react-icons/md"
import { Input, MyWindow, OneMenu } from "../pages/_app";
import { useCallback } from "react";
import { useContext } from "react";
import { LocalizedStrings } from "../pages/api/localization";

export interface Stop {
    value?: string
    network?: number;
    ls_id: number;
    s_id: number;
    site_code: string;
}

export const StopIcon = ({ network, size, ...props }: { network: Number, size?: number }) => {
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

const Dropdown = ({ children, ...props }: any) => {
    return (<ScrollArea
        sx={{
            maxHeight: '25vh',
            width: '100%',
        }}>
        {children}
    </ScrollArea>)
}

const AutoCompleteItem = forwardRef<HTMLDivElement, SelectItemProps & Stop>(
    ({ value, network, ls_id, s_id, site_code, ...others }: SelectItemProps & Stop, ref) => (
        <div key={`${ls_id}-${s_id}-${site_code}`} ref={ref} {...others}>
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

export type StopSetter = (a: Stop | undefined) => void

export const StopInput = ({ variant, style, strings }: { variant: "from" | "to", style?: CSSProperties, strings: LocalizedStrings }) => {
    const { oneMenu, setOneMenu } = useContext(OneMenu)
    const [data, setData] = useState<Array<Stop & any>>([])
    const i = useContext(Input)
    const [selected, setSelected] = [i.selection[variant], ((e: Stop | undefined) => { i.setSelection({ ...i.selection, [variant]: e }) })]
    const [input, setInput] = [i.input[variant], ((e: string) => { i.setInput({ ...i.input, [variant]: e }) })]
    const [cookies, setCookie, removeCookie] = useCookies(['selected-networks', 'no-page-transitions']);
    const [stops, setStops] = useLocalStorage<Array<Stop>>({ key: "frequent-stops", defaultValue: [] })
    const ref = useRef<HTMLInputElement | null>(null)

    const swap = useCallback(() => {
        const s = i.selection
        const inp = i.input
        i.setSelection({ from: s.to, to: s.from })
        i.setInput({ from: inp.to, to: inp.from })
    }, [i])

    useEffect(() => {
        if (selected && typeof window !== 'undefined') {
            (window as unknown as MyWindow).dataLayer.push({ event: "stopinput-select", ...selected })
        }
    }, [selected])

    useEffect(() => {
        if (input.length == 0) {
            setData(stops)
        }
    }, [input, stops])

    const load = (e: string) => {
        if (!e.length) { return }
        apiCall("POST", "/api/autocomplete", { 'input': e, 'networks': cookies["selected-networks"] }).then(resp => {
            setData((resp.results as Array<any>).map((item, i) => ({ value: item.lsname, ls_id: item.ls_id, s_id: item.settlement_id, site_code: item.site_code, network: item.network_id })))
        })
    }

    // useeffect on input change timeout 500 ms and then call load function
    useEffect(() => {
        load(input)
    }, [input]);

    return (<Autocomplete
        icon={selected ? <StopIcon network={selected.network!} /> : (variant === "from" ? <IconArrowBarRight size={18} stroke={1.5} /> : <IconArrowBarToRight size={18} stroke={1.5} />)}
        style={style}
        data={data.filter((item, i, array) => array.findIndex((e) => e.value === item.value) === i)}
        ref={ref}
        switchDirectionOnFlip={false}
        size="md"
        className="searchInput"
        variant="unstyled"
        transition="scale-y"
        transitionDuration={200}
        rightSection={typeof selected === 'undefined' && input.length === 0 ? <></> :
            <Menu transition="scale-y" transitionDuration={200} onClose={() => setOneMenu(0)} onOpen={() => setOneMenu(variant === "from" ? 1 : 2)} opened={variant === "from" ? oneMenu === 1 : oneMenu === 2} position="bottom-end" styles={{ dropdown: { minWidth: '15rem' } }}>
                <Menu.Target>
                    <ActionIcon variant="transparent">
                        <IconDots />
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown role="menu">
                    <Menu.Label>{variant === 'from' ? strings.fromWhere : strings.toWhere}</Menu.Label>
                    <Menu.Item role="menuitem" onClick={() => {
                        setInput("")
                        setSelected(undefined)
                    }} color="red" icon={<IconX />}>
                        {strings.clearField}
                    </Menu.Item>
                    <Menu.Divider role="separator" />
                    <Menu.Label>{strings.allFields}</Menu.Label>
                    <Menu.Item role="menuitem" onClick={swap} icon={<IconRefresh />}>
                        {strings.swapFields}
                    </Menu.Item>
                    <Menu.Item role="menuitem" onClick={() => {
                        i.setInput({ from: "", to: "" })
                        i.setSelection({ from: undefined, to: undefined })
                    }} color="red" icon={<IconClearAll />}>
                        {strings.clearFields}
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>}
        sx={(theme) => ({ borderBottom: '3px solid #373A40', '& .mantine-Autocomplete-dropdown': { border: '1px solid', borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2], borderRadius: theme.radius.md, padding: theme.spacing.xs / 6 }, '& .mantine-Autocomplete-item': { borderRadius: theme.radius.sm } })}
        filter={() => true}
        dropdownComponent={Dropdown}
        itemComponent={AutoCompleteItem}
        id={`stopinput-${variant}`}
        onItemSubmit={(e: any) => { setSelected(e); ref.current?.blur(); setStops([e, ...stops.filter(item => !isEqual(item, e))]) }}
        onChange={(e) => { setSelected(undefined); setInput(e) }}
        value={selected?.value || input || ""}
        limit={99}
        placeholder={variant === "from" ? strings.fromWhere : strings.toWhere}
        rightSectionWidth={42}
    />)
}