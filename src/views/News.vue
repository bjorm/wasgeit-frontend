<template>
  <div>
    <h2 hidden aria-hidden="false">News</h2>
    <ul>
      <li v-for="day in days">
        <h3>{{ buildTitle(day) }}</h3>

        <ul>
          <li v-for="ev in news[day]">
            <span class="venue-badge">{{ formatDate(ev.datetime) }}</span>
            <a v-bind:href="ev.url">{{ ev.title }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {formatDate} from '@/shared/formatted-date'
  import {News} from '@/model'

  @Component({})
  export default class NewsView extends Vue {
    public news: News = {}
    public days: string[] = []

    public formatDate(date: string): string {
      return formatDate(date)
    }

    public mounted() {
      fetch('/rest/news').then((response) => response.json()).then((newsJson) => {
        this.days = Object.keys(newsJson).sort().reverse()
        this.news = newsJson
      })
    }

    public buildTitle(isoDate: string): string {
      const MS_IN_A_DAY = 1000 * 60 * 60 * 24
      const date = new Date(isoDate)
      const today = new Date()
      const diffInMs = today.getTime() - date.getTime()
      const diffInDays = Math.floor(diffInMs / MS_IN_A_DAY)

      switch (diffInDays) {
        case 0:
          return 'Heute gefunden'
        case 1:
          return 'Gestern gefunden'
        default:
          return `Vor ${diffInDays} Tagen gefunden`
      }
    }

  }
</script>
