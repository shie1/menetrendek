import { Autocomplete, ScrollArea, Group, Text, Box } from "@mantine/core"
import { SelectItemProps } from "@mantine/core/lib/Select";
import { useLocalStorage } from "@mantine/hooks";
import { IconMapPin, IconBus, IconTrain, IconQuestionMark, IconArrowBarRight, IconArrowBarToRight, IconShip, IconEqual } from "@tabler/icons";
import { isEqual } from "lodash";
import { CSSProperties, forwardRef, useEffect, useRef, useState } from "react"
import { useCookies } from "react-cookie";
import { apiCall } from "./api";
import { MdTram } from "react-icons/md"

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
            maxHeight: 240,
            width: '100%',
        }}>
        {children}
    </ScrollArea>)
}

const AutoCompleteItem = forwardRef<HTMLDivElement, SelectItemProps & Stop>(
    ({ value, network, ls_id, s_id, site_code, ...others }: SelectItemProps & Stop, ref) => (
        <div key={`${ls_id}-${s_id}-${site_code}`} ref={ref} {...others}>
            <Group align="left">
                <div style={{ zIndex: '99 !important' }}>
                    <StopIcon network={network!} />
                </div>
                <div>
                    <Text>{value}</Text>
                </div>
            </Group>
        </div >
    )
);

export type StopSetter = (a: Stop | undefined) => void

export const StopInput = ({ variant, selection, style }: { variant: "from" | "to", selection: { selected: Stop | undefined, setSelected: StopSetter, }, style?: CSSProperties }) => {
    const [data, setData] = useState<Array<any>>([])
    const [input, setInput] = useState<string>("")
    const [cookies, setCookie, removeCookie] = useCookies(['selected-networks', 'no-page-transitions']);
    const { selected, setSelected } = selection
    const [stops, setStops] = useLocalStorage<Array<Stop>>({ key: "frequent-stops", defaultValue: [] })
    const ref = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (!input) {
            setData(stops)
        }
    }, [data])

    const load = (e: string) => {
        setSelected(undefined)
        if (!e.length) { setData([]); return }
        apiCall("POST", "/api/autocomplete", { 'input': e, 'networks': cookies["selected-networks"] }).then(resp => {
            setData((resp.results as Array<any>).map(item => ({ value: item.lsname, ls_id: item.ls_id, s_id: item.settlement_id, site_code: item.site_code, network: item.network_id })))
        })
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (input) { load(input); setInput(input) }
            if (selected) setSelected(selected)
        }, 500)
        return () => clearTimeout(timer)
    }, [input])

    return (<Autocomplete
        icon={selected ? <StopIcon network={selected.network!} /> : (variant === "from" ? <IconArrowBarRight size={18} stroke={1.5} /> : <IconArrowBarToRight size={18} stroke={1.5} />)}
        style={style}
        data={data}
        ref={ref}
        size="md"
        className="searchInput"
        variant="unstyled"
        sx={{ borderBottom: '3px solid #373A40' }}
        filter={() => true}
        dropdownComponent={Dropdown}
        itemComponent={AutoCompleteItem}
        id={`stopinput-${variant}`}
        onItemSubmit={(e: any) => { setSelected(e); ref.current?.blur(); setStops([e, ...stops.filter(item => !isEqual(item, e))]) }}
        onChange={(e) => { if (!e) { setData([]) }; setSelected(undefined); setInput(e) }}
        onBlur={(e) => { if (!e.currentTarget.value) { setData([]) } }}
        onFocus={() => { setSelected(undefined) }}
        value={selected?.value || input}
        limit={99}
        placeholder={variant === "from" ? "Honnan?" : "Hova?"}
        rightSectionWidth={42}
    />)
}