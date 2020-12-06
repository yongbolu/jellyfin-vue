<template>
  <v-container>
    <v-row justify="center">
      <v-btn-toggle v-model="searchTab" tile group color="primary">
        <v-btn :value="0">Top results</v-btn>
        <v-btn :value="1">Movies</v-btn>
        <v-btn :value="2">Shows</v-btn>
        <v-btn :value="3">Albums</v-btn>
        <v-btn :value="4">Tracks</v-btn>
        <v-btn :value="5">Books</v-btn>
        <v-btn :value="6">People</v-btn>
      </v-btn-toggle>
    </v-row>
    <v-row>
      <v-col>
        <v-tabs-items v-model="searchTab" class="transparent">
          <v-tab-item :key="0">
            <item-grid :items="topSearchResults" />
          </v-tab-item>
          <v-tab-item :key="1">
            <item-grid :items="movieSearchResults" />
          </v-tab-item>
          <v-tab-item :key="2">
            <item-grid :items="showSearchResults" />
          </v-tab-item>
          <v-tab-item :key="3">
            <item-grid :items="albumSearchResults" />
          </v-tab-item>
          <v-tab-item :key="4">
            <item-grid :items="trackSearchResults" />
          </v-tab-item>
          <v-tab-item :key="5">
            <item-grid :items="bookSearchResults" />
          </v-tab-item>
          <v-tab-item :key="6">
            <item-grid :items="personSearchResults" />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { flatten, zip } from 'lodash';
import Vue from 'vue';
import { mapActions } from 'vuex';
import { BaseItemDto } from '~/api';

export default Vue.extend({
  data() {
    return {
      searchTab: 0,
      topSearchResults: [] as BaseItemDto[],
      movieSearchResults: [] as BaseItemDto[],
      showSearchResults: [] as BaseItemDto[],
      albumSearchResults: [] as BaseItemDto[],
      trackSearchResults: [] as BaseItemDto[],
      bookSearchResults: [] as BaseItemDto[],
      personSearchResults: [] as BaseItemDto[]
    };
  },
  computed: {
    searchQuery() {
      return this.$store.state.search.query;
    }
  },
  watch: {
    searchQuery(newQuery: string, _oldQuery: string) {
      if (newQuery === '') {
        this.$router.back();
      } else {
        this.performSearch();
      }
    }
  },
  beforeMount() {
    if (this.searchQuery === '') {
      this.$router.back();
    }
  },
  destroyed() {
    // Reset the query when leaving the search page
    this.setSearchQuery({ query: '' });
  },
  methods: {
    ...mapActions('search', ['setSearchQuery']),
    async performSearch() {
      const itemResults = (
        await this.$api.items.getItemsByUserId({
          userId: this.$auth.user.Id,
          searchTerm: this.searchQuery,
          includeItemTypes:
            'Movie,Series,Audio,MusicAlbum,Book,MusicArtist,Person',
          recursive: true
        })
      ).data.Items;

      this.topSearchResults = itemResults.slice(0, 24);
      this.movieSearchResults = itemResults.filter(
        (item: BaseItemDto) => item.Type === 'Movie'
      );
      this.showSearchResults = itemResults.filter(
        (item: BaseItemDto) => item.Type === 'Series'
      );
      this.albumSearchResults = itemResults.filter(
        (item: BaseItemDto) => item.Type === 'MusicAlbum'
      );
      this.trackSearchResults = itemResults.filter(
        (item: BaseItemDto) => item.Type === 'Audio'
      );
      this.bookSearchResults = itemResults.filter(
        (item: BaseItemDto) => item.Type === 'Book'
      );
      const persons = (
        await this.$api.persons.getPersons({
          userId: this.$auth.user.Id,
          searchTerm: this.searchQuery
        })
      ).data.Items;
      const artists = itemResults.filter(
        (item: BaseItemDto) => item.Type === 'MusicArtist'
      );
      this.personSearchResults = flatten(zip(persons, artists)).filter(
        (item: any) => item !== undefined
      ) as BaseItemDto[];
    }
  }
});
</script>
