import { Autocomplete, Group, MantineColor, ScrollArea, SelectItemProps, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconArrowBarRight, IconArrowBarToRight, IconBus, IconTrain, IconMapPin } from "@tabler/icons";
import { forwardRef, useEffect, useRef, useState } from "react";
import { apiCall } from "./api";
import { isEqual } from "lodash"
import { useCookies } from "react-cookie";

interface ItemProps extends SelectItemProps {
  color: MantineColor;
  type: "megallo" | "telepules";
  network: Number;
}

const r = /[^a-zA-Z0-9áéíöőüű ]/g

export const StopIcon = ({ network, size, ...props }: { network: Number, size?: number, }) => {
  props = { ...props, size: size ? size : 24 }
  switch (network) {
    case 0: // City
      return <IconMapPin {...props} />
    case 1: // Bus station
    case 10: // Bus stop (A)
    case 24: // Bus stop (B)
      return <IconBus {...props} />
    case 2: // Train station
      return <IconTrain {...props} />
    default:
      return <></>
  }
}

const Dropdown = ({ children, ...props }: any) => {
  return (<ScrollArea
    sx={{
      maxHeight: 240,
      width: '100%',
    }}>{children}</ScrollArea>)
}

export const StopInput = ({ variant, error, selection }: { variant: "from" | "to", error?: string, selection: Array<any> }) => {
  const [data, setData] = useState<Array<any>>([])
  const [stops, setStops] = useLocalStorage<Array<any>>({ key: 'frequent-stops', defaultValue: [] })
  const ref = useRef<HTMLInputElement | null>(null)
  const [selected, setSelected] = selection
  const [cookies, setCookie, removeCookie] = useCookies(['selected-networks']);
  const [lastKey, setLastKey] = useState<string>("")

  useEffect(() => {
    if (selected) { setStops([selected, ...stops.filter(item => !isEqual(item, selected))]) }
  }, [selected])

  const AutoCompleteItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ value, network, id, ...others }: ItemProps, ref) => (
      <div key={`${id}-${value}-${network}`} ref={ref} {...others}>
        <Group noWrap>
          <StopIcon network={network} />
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
      setData((resp.results as Array<any>).map(item => ({ value: item.lsname, id: item.ls_id, sid: item.settlement_id, network: item.network_id })))
    })
  }

  return (<Autocomplete
    icon={selected ? <StopIcon network={selected.network} /> : (variant === "from" ? <IconArrowBarRight size={18} stroke={1.5} /> : <IconArrowBarToRight size={18} stroke={1.5} />)}
    radius="xl"
    ref={ref}
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
    onChange={(e) => { load(e) }}
    onFocus={(e) => {
      setSelected(null)
      if (!cookies["selected-networks"].length) {
        setCookie("selected-networks", ['1', '2', '25', '3', '10,24', '13', '12', '11', '14'], { path: '/', maxAge: 60 * 60 * 24 * 365 })
      }
    }}
    onItemSubmit={(e) => { setSelected(e); ref.current?.blur() }}
    placeholder={variant === "from" ? "Honnan?" : "Hova?"}
    rightSectionWidth={42}
  />)
}