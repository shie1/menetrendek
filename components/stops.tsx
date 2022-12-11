import { Autocomplete, ScrollArea, Group, Text } from "@mantine/core"
import { SelectItemProps } from "@mantine/core/lib/Select";
import { useLocalStorage } from "@mantine/hooks";
import { IconMapPin, IconBus, IconTrain, IconQuestionMark, IconArrowBarRight, IconArrowBarToRight } from "@tabler/icons";
import { isEqual } from "lodash";
import { forwardRef, useEffect, useRef, useState } from "react"
import { useCookies } from "react-cookie";
import { AnimatedLayout } from "../pages/_app";
import { apiCall } from "./api";

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
            return <IconBus {...props} />
        case 2: // Train station (A)
        case 14: // Train station (B)
            return <IconTrain {...props} />
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
        <AnimatedLayout>
            {children}
        </AnimatedLayout>
    </ScrollArea>)
}

const AutoCompleteItem = forwardRef<HTMLDivElement, SelectItemProps & Stop>(
    ({ value, network, ls_id, s_id, site_code, ...others }: SelectItemProps & Stop, ref) => (
        <div key={`${ls_id}-${s_id}-${site_code}`} ref={ref} {...others}>
            <Group align="center" noWrap>
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

export const StopInput = ({ variant, selection }: { variant: "from" | "to", selection: { selected: Stop | undefined, setSelected: StopSetter } }) => {
    const [data, setData] = useState<Array<any>>([])
    const [input, setInput] = useState<string>("")
    const [cookies, setCookie, removeCookie] = useCookies(['selected-networks', 'nerf-mode']);
    const { selected, setSelected } = selection
    const [stops, setStops] = useLocalStorage<Array<Stop>>({ key: "frequent-stops", defaultValue: [] })
    const ref = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (cookies["nerf-mode"] === "true") {
            if (!data.length) {
                setData(stops)
            }
        } else {
            if (data.length && isEqual(stops, data)) {
                setData([])
            }
        }
    }, [data, cookies])

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
        style={{ minWidth: '15rem' }}
        data={data}
        ref={ref}
        size="md"
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