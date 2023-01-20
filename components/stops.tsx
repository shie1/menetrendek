import { forwardRef, useContext, useState } from "react";
import { Input } from "../pages/_app";
import { MdTram } from "react-icons/md"
import { Autocomplete, Box, Group, ScrollArea, SelectItemProps, Text } from "@mantine/core/";
import { IconMapPin, IconBus, IconTrain, IconEqual, IconShip, IconQuestionMark, IconArrowBarRight, IconArrowBarToRight } from "@tabler/icons";

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
    const i = useContext(Input)
    const [selected, setSelected] = [i.selection[variant], ((e: Stop | undefined) => { i.setSelection({ ...i.selection, [variant]: e }) })]
    const [input, setInput] = [i.input[variant], ((e: string) => { i.setInput({ ...i.input, [variant]: e }) })]
    return (<Autocomplete
        icon={selected ? <StopIcon network={selected.network as number} /> : (variant == 'from' ? <IconArrowBarRight /> : <IconArrowBarToRight />)}
        data={data}
        size="lg"
        sx={(theme) => ({ borderBottom: `2px solid ${theme.colors.gray[8]}` })}
        itemComponent={AutoCompleteItem}
        variant="unstyled"
    />)
}