import { Autocomplete, Avatar, Group, MantineColor, SelectItemProps, Text } from "@mantine/core"
import { IconArrowBarRight, IconArrowBarToRight, IconCircle, IconBus } from "@tabler/icons"
import { forwardRef, useEffect, useState } from "react"
import { apiCall } from "./api";

interface ItemProps extends SelectItemProps {
  color: MantineColor;
  type: "megallo" | "telepules";
}

const StopInput = ({ variant, onChange, error }: { variant: "from" | "to", onChange?: Function, error?: string }) => {
  const [data, setData] = useState<Array<any>>([])
  const [selected, setSelected] = useState<any>(null)

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
    setSelected(null); if (onChange) onChange(null)
    if (!e.length) { setData([]); return }
    apiCall("GET", "/api/autocomplete", { 'q': e }).then(resp => {
      setData((resp.results as Array<any>).map(item => ({ value: item.lsname, id: item.settlement_id, type: item.type })))
    })
  }

  return (<Autocomplete
    icon={selected ? (selected.type === "megallo" ? <IconBus size={18} stroke={1.5} /> : <IconCircle size={18} stroke={1.5} />) : (variant === "from" ? <IconArrowBarRight size={18} stroke={1.5} /> : <IconArrowBarToRight size={18} stroke={1.5} />)}
    radius="xl"
    size="md"
    limit={10}
    itemComponent={AutoCompleteItem}
    data={data}
    error={error}
    onChange={load}
    onItemSubmit={(e) => { setSelected(e); if (onChange) onChange(e) }}
    placeholder={variant === "from" ? "Honnan?" : "Hova?"}
    rightSectionWidth={42}
  />)
}

export default StopInput