import * as React from 'react'
import {Event} from "../model/event"
import {FormattedDate} from "./formatted-date"
import {News} from "../model/news"
import {Observable, Subscription} from "rxjs"
import {ajax} from "rxjs/ajax"
import {pluck} from "rxjs/operators"
import {Agenda} from "../model/agenda"

export const NewsComponent = () => {
    let news$: Observable<Agenda> = ajax('/rest/news').pipe(pluck('response'))

    return (
        <div>
            <h2 className={'hidden'}>News</h2>
            <NewsList news$={news$}/>
        </div>
    )
}

const EventComponent = ({event}: { event: Event }) => {
    return (
        <li>
            <a href={event.venue.URL}
               className={'venue-badge'}>{event.venue.Name}</a>
            &nbsp;
            <a href={event.url}>{event.title}</a>
        </li>
    )
}

const DayComponent = ({day, events}: { day: string, events: Event[] }) => {
    return (
        <li>
            <h3><FormattedDate isoDateString={day}/></h3>
            <ul>
                {events.map((event: Event) => <EventComponent key={event.url} event={event}/>)}
            </ul>
        </li>
    )
}

interface NewsListState {
    news: News
    days: string[]
    sub: Subscription
}

interface NewsListProps {
    news$: Observable<News>
}

export class NewsList extends React.Component<NewsListProps, NewsListState> {
    constructor(props: NewsListProps) {
        super(props)
        this.state = {news: {}, days: [], sub: null}
    }

    componentDidMount() {
        let sub = this.props.news$.subscribe((news: News) => {
            this.setState({news, days: Object.keys(news), sub})
        })
    }

    componentWillUnmount() {
        this.state.sub.unsubscribe()
        this.setState({sub: null})
    }

    render() {
        return (
            <ul>
                {this.state.days.map((day: string) => {
                    let events = this.state.news[day]
                    return <DayComponent key={day} day={day} events={events}/>
                })}
            </ul>
        )
    }
}