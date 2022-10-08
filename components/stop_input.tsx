import { Autocomplete, Group, MantineColor, ScrollArea, SelectItemProps, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconArrowBarRight, IconArrowBarToRight, IconCircle, IconBus } from "@tabler/icons"
import { forwardRef, useEffect, useRef, useState } from "react";
import { apiCall } from "./api";
import { isEqual } from "lodash"

interface ItemProps extends SelectItemProps {
  color: MantineColor;
  type: "megallo" | "telepules";
}

const r = /[^a-zA-Z0-9áéíöőüű ]/g

const Dropdown = ({ children }: any) => {
  return (<ScrollArea
    sx={(theme) => ({
      maxHeight: 240,
      width: '100%',
    })}>{children}</ScrollArea>)
}

const StopInput = ({ variant, error, selection }: { variant: "from" | "to", error?: string, selection: Array<any> }) => {
  const [data, setData] = useState<Array<any>>([])
  const [stops, setStops] = useLocalStorage<Array<any>>({ key: 'frequent-stops', defaultValue: [] })
  const ref = useRef<HTMLInputElement | null>(null)
  const [selected, setSelected] = selection

  useEffect(() => {
    if (selected) { setStops([selected, ...stops.filter(item => !isEqual(item, selected))]) }
  }, [selected])

  const AutoCompleteItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ value, type, id, ...others }: ItemProps, ref) => (
      <div key={id} ref={ref} {...others}>
        <Group noWrap>
          {type === "telepules" ? <IconCircle size={18} /> : <IconBus size={18} />}
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
    apiCall("GET", "/api/autocomplete", { 'q': e }).then(resp => {
      setData((resp.results as Array<any>).map(item => ({ value: item.lsname, id: item.ls_id, sid: item.settlement_id, type: item.type })))
    })
  }

  return (<Autocomplete
    icon={selected ? (selected.type === "megallo" ? <IconBus size={18} stroke={1.5} /> : <IconCircle size={18} stroke={1.5} />) : (variant === "from" ? <IconArrowBarRight size={18} stroke={1.5} /> : <IconArrowBarToRight size={18} stroke={1.5} />)}
    radius="xl"
    ref={ref}
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
    onChange={load}
    onFocus={() => setSelected(null)}
    onItemSubmit={(e) => { setSelected(e); ref.current?.blur() }}
    placeholder={variant === "from" ? "Honnan?" : "Hova?"}
    rightSectionWidth={42}
  />)
}

export default StopInput