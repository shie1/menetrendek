import { Autocomplete, Group, MantineColor, ScrollArea, SelectItemProps, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconArrowBarRight, IconArrowBarToRight, IconBus, IconTrain, IconMapPin, IconQuestionMark } from "@tabler/icons";
import { forwardRef, useEffect, useRef, useState } from "react";
import { apiCall } from "./api";
import { isEqual } from "lodash"
import { useCookies } from "react-cookie";

export interface Stop {
  value?: string
  network?: number;
  ls_id: number;
  s_id: number;
  site_code: string;
}

const r = /[^a-zA-Z0-9áéíöőüű ]/g

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
    }}>{children}</ScrollArea>)
}

export const StopInput = ({ variant, error, selection, rightSection }: { variant: "from" | "to", error?: string, selection: Array<Stop | any>, rightSection?: any }) => {
  const [data, setData] = useState<Array<any>>([])
  const [stops, setStops] = useLocalStorage<Array<any>>({ key: 'frequent-stops', defaultValue: [] })
  const ref = useRef<HTMLInputElement | null>(null)
  const [selected, setSelected] = selection
  const [cookies, setCookie, removeCookie] = useCookies(['selected-networks']);
  const [lastKey, setLastKey] = useState<string>("")

  const AutoCompleteItem = forwardRef<HTMLDivElement, SelectItemProps & Stop>(
    ({ value, network, ls_id, s_id, site_code, ...others }: SelectItemProps & Stop, ref) => (
      <div key={`${ls_id}-${s_id}-${site_code}`} ref={ref} {...others}>
        <Group noWrap>
          <StopIcon network={network!} />
          <div>
            <Text>{value}</Text>
          </div>
        </Group>
      </div >
    )
  );

  const load = (e: string) => {
    setSelected(null)
    if (!e.length) { setData([]); return }
    apiCall("POST", "/api/autocomplete", { 'input': e, 'networks': cookies["selected-networks"] }).then(resp => {
      setData((resp.results as Array<any>).map(item => ({ value: item.lsname, ls_id: item.ls_id, s_id: item.settlement_id, site_code: item.site_code, network: item.network_id })))
    })
  }

  return (<Autocomplete
    icon={typeof selected !== 'string' && selected ? <StopIcon network={selected.network} /> : (variant === "from" ? <IconArrowBarRight size={18} stroke={1.5} /> : <IconArrowBarToRight size={18} stroke={1.5} />)}
    radius="xl"
    ref={ref}
    rightSection={rightSection}
    id={`stopinput-${variant}`}
    onKeyDown={(e) => {
      setLastKey(e.key)
      if (e.key == "Enter" && !lastKey.startsWith("Arrow")) { e.preventDefault(); window.dispatchEvent(new Event("search-trigger")) }
    }}
    size="md"
    limit={99}
    variant="default"
    itemComponent={AutoCompleteItem}
    dropdownComponent={Dropdown}
    data={data}
    value={selected?.value}
    filter={(value, item) => {
      const a = value.toLowerCase().replace(r, '')
      const b = item.value.toLowerCase().replace(r, '').substring(0, a.length)
      return a.startsWith(b)
    }}
    error={error}
    sx={{ input: { border: '1px solid #7c838a' } }}
    onChange={(e) => { load(e); setSelected(e) }}
    onFocus={(e) => {
      setSelected(null)
      if (!cookies["selected-networks"].length) {
        setCookie("selected-networks", ['1', '2', '25', '3', '10,24', '13', '12', '11', '14'], { path: '/', maxAge: 60 * 60 * 24 * 365 })
      }
    }}
    onItemSubmit={(e) => {
      setSelected(e)
      ref.current?.blur()
      setStops([e, ...stops.filter(item => !isEqual(item, e))])
    }}
    placeholder={variant === "from" ? "Honnan?" : "Hova?"}
    rightSectionWidth={42}
  />)
}