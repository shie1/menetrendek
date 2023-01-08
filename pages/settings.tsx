import type { NextPage } from "next"
import PageTransition from "../components/pageTransition"
import { Stack, Text, Image, SegmentedControl, Center, NumberInput, Divider, Group, Button } from "@mantine/core";
import { CheckboxCard, ContentCard } from "../components/checkCard"
import { useCookies } from "react-cookie"
import { IconDiscount, IconWalk, IconCalendar, IconMap2, IconDownload } from "@tabler/icons";
import { RouteExposition } from "../components/routes"
import { transferExample } from "../components/mockdata"
import { useUserAgent } from "../components/ua"
import { appShortName, appThumb } from "./_document";
import { useMediaQuery } from "@mantine/hooks";
import { Canonical, SEO } from "../components/seo";
import { LocalizedStrings } from "./api/localization";

const Settings: NextPage = (props: any) => {
    const strings: LocalizedStrings = props.strings
    const [cookies, setCookie, removeCookie] = useCookies(['no-page-transitions', 'discount-percentage', 'action-timeline-type', 'route-limit', 'use-route-limit', 'calendar-service', 'blip-limit'])
    const img = (theme: any) => ({ '& img': { boxShadow: theme.shadows.lg, borderRadius: theme.radius.lg, border: '1px solid', borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2] }, })
    const ua = useUserAgent()
    const segmentedBreak = useMediaQuery('(max-width: 640px)');
    const dlBreak = useMediaQuery('(max-width: 810px)');

    return (<PageTransition>
        <SEO
            title={appShortName}
            description={strings.appDescription}
            image={appThumb}
        >
            <title>{strings.settings} | {appShortName}</title>
            <Canonical url="https://menetrendek.info/settings" />
        </SEO>
        <Stack>
            {!props.prompt ? <></> :
                <ContentCard icon={IconDownload} title={strings.downloadApp}>
                    <Stack spacing={4} sx={{ position: 'relative' }}>
                        <Text size="md" sx={{ maxWidth: dlBreak ? 'unset' : 'calc(100% - 130px)' }}>
                            {strings.settingsDownloadPitch}
                        </Text>
                        <Group sx={dlBreak ? {} : { position: 'absolute', bottom: 0, right: 0 }} position="right">
                            <Button onClick={() => { props.prompt.prompt() }} leftIcon={<IconDownload />}>
                                {strings.download}
                            </Button>
                        </Group>
                    </Stack>
                </ContentCard>
            }
            <Divider label={<Text size="md">{strings.basicPreferences}</Text>} size="lg" />
            <ContentCard icon={IconDiscount} title={strings.discount}>
                <Stack spacing={4}>
                    <Text size="md">{strings.discountSubtext}</Text>
                    <NumberInput
                        value={Number(cookies['discount-percentage']) || 0}
                        onChange={(e) => setCookie("discount-percentage", e, { path: '/', maxAge: 60 * 60 * 24 * 365 })}
                        min={0} max={100} size="md"
                    />
                </Stack>
            </ContentCard>
            <ContentCard icon={IconCalendar} title={strings.calendarService}>
                <Stack spacing={4}>
                    <Text size="md">{strings.calendarService}</Text>
                    <Text mt={-4} size="sm">{strings.recommendedForDevice}: {ua?.device.vendor === "Apple" ? `${strings.other} (ICS)` : strings.any}</Text>
                    <Stack justify="center">
                        <SegmentedControl size={segmentedBreak ? "md" : "sm"} fullWidth orientation={segmentedBreak ? "vertical" : "horizontal"} value={cookies["calendar-service"] || '1'} onChange={(e) => setCookie("calendar-service", e, { path: '/', maxAge: 60 * 60 * 24 * 365 })} data={[{ label: "Google Calendar", value: '1' }, { label: "Outlook", value: '2' }, { label: "Office 365", value: '3' }, { label: "Yahoo", value: '4' }, { label: `${strings.other} (ICS)`, value: '5' }]} />
                    </Stack>
                </Stack>
            </ContentCard>
            <Stack spacing={0}>
                <Divider label={<Text size="md">{strings.otherSettings}</Text>} size="lg" />
                <Text size="sm">{strings.otherSettingsSubtext}</Text>
            </Stack>
            <CheckboxCard title={strings.routeLimit} checked={cookies["use-route-limit"] === "true"} onChange={(e) => { setCookie("use-route-limit", e, { path: '/', maxAge: 60 * 60 * 24 * 365 }) }}>
                <Stack spacing={4}>
                    <Text size="md">{strings.routeLimitSubtext}</Text>
                    <Text mt={-4}>{strings.routeLimitSubtext2}</Text>
                    <Text mt={-4} size="xs" color="yellow">{strings.notRecommendedToDisable}</Text>
                    <NumberInput
                        value={Number(cookies['route-limit']) || 0}
                        placeholder="10"
                        onChange={(e) => setCookie("route-limit", e, { path: '/', maxAge: 60 * 60 * 24 * 365 })}
                        min={10} max={100} size="md"
                    />
                    <Image sx={img} alt="Útvonalterv limit" src="/api/img/route-limit.png" />
                </Stack>
            </CheckboxCard>
            <ContentCard icon={IconMap2} title={strings.visibleRunsOnMap}>
                <Stack spacing={4}>
                    <Text size="md">{strings.visibleRunsOnMapSubText}</Text>
                    <NumberInput
                        value={Number(cookies['blip-limit']) || 0}
                        placeholder="25"
                        onChange={(e) => setCookie("blip-limit", e, { path: '/', maxAge: 60 * 60 * 24 * 365 })}
                        min={10} max={50} size="md"
                    />
                </Stack>
            </ContentCard>
            <ContentCard icon={IconWalk} title={strings.timelineType}>
                <Stack spacing={4}>
                    <Text size="md">{strings.timelineTypeSubtext}</Text>
                    <Stack justify="center">
                        <SegmentedControl fullWidth data={[{ label: "A", value: '1' }, { label: "B", value: '2' }]} value={cookies["action-timeline-type"] || "1"} onChange={(e) => setCookie("action-timeline-type", e, { path: '/', maxAge: 60 * 60 * 24 * 365 })} />
                        <Center p="sm">
                            <RouteExposition strings={strings} details={transferExample} query={{ user: { discount: 0, actionTimelineType: Number(cookies["action-timeline-type"]) } }} withInfoButton={false} />
                        </Center>
                    </Stack>
                </Stack>
            </ContentCard>
            <CheckboxCard checked={cookies["no-page-transitions"] === "false"} onChange={(e) => { setCookie("no-page-transitions", !e, { path: '/', maxAge: 60 * 60 * 24 * 365 }) }} title={strings.contentTransitions}>
                <Stack spacing={4}>
                    <Text size="md">{strings.contentTransitionsSubtext}</Text>
                    <Text mt={-4}>{strings.contentTransitionsSubtext2}</Text>
                    <Image sx={img} alt="Tartalomátmenetek ki- és bekapcsolt állapotban" src="https://i.imgur.com/tJv1MPE.gif" />
                </Stack>
            </CheckboxCard>
        </Stack>
    </PageTransition >)
}

export default Settings