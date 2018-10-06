/**
 * Discord bot
 *
 * (c) 2018 ryosebach
 */
export const rainCloudUrl = {
    tokyo: 'https://weather.yahoo.co.jp/weather/raincloud/13/?c=g2',
    kanto: 'https://weather.yahoo.co.jp/weather/raincloud/3.html?c=g2'
};

export interface TrainInfo {
    route_name: string;
    descriiption: string;
    url: string;
    selector: string;
    paddingTop: number;
    paddingLeft: number;
    paddingRight: number;
    paddingBottom: number;
    delete_selector?: string;
}

export const trainInfos: TrainInfo[] = [
    {
        route_name: 'yamanote',
        descriiption: '山手線',
        url: 'https://transit.yahoo.co.jp/traininfo/detail/21/0/',
        selector: 'div #mdServiceStatus',
        paddingTop: 80,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 400,
        delete_selector: 'div .pos-im'
    },
    {
        route_name: 'tokyu_meguro',
        descriiption: '東急目黒線',
        url: 'https://transit.yahoo.co.jp/traininfo/detail/113/0/',
        selector: 'div #mdServiceStatus',
        paddingTop: 80,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 400,
        delete_selector: 'div .pos-im'
    },
    {
        route_name: 'seibu_shinjuku',
        descriiption: '西武新宿線',
        url: 'https://transit.yahoo.co.jp/traininfo/detail/86/0/',
        selector: 'div #mdServiceStatus',
        paddingTop: 80,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 400,
        delete_selector: 'div .pos-im'
    }
];
