<template>
  <v-container fluid class="pa-0 item-container">
    <v-img
      v-resize="updateBackdropImage"
      :src="backdropImageSource"
      class="d-flex align-end backdrop-image"
      max-width="100%"
    >
      <div class="d-flex align-end gradient-container">
        <div class="d-flex flex-wrap item-details-container">
          <div class="white--text">
            <v-img
              v-if="
                item.ImageTags && item.ImageTags.Logo && getAspectRatio() > 1
              "
              :src="getImageUrl(item.Id, 'Logo')"
              contain
              :alt="item.Name"
              max-width="50%"
              class="mb-4"
            ></v-img>
            <h1 v-else>{{ item.Name }}</h1>
            <div class="item-sub-heading">{{ renderItemSubHeading() }}</div>
            <p class="item-overview">{{ item.Overview }}</p>
          </div>
          <div class="item-details-right">
            <v-btn
              class="play-button"
              color="primary"
              :to="`./${item.Id}/play`"
              >{{ $t('playType', { mediaType: item.Type }) }}</v-btn
            >
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" v-bind="attrs" v-on="on">
                  {{ $t('more') }}
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(option, index) in moreOptions"
                  :key="index"
                  @click="openDialog(option)"
                >
                  <v-list-item-title>{{ option.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-dialog v-model="identifyDialog" width="500">
              <identify-item
                :itemId="item.Id"
                @identified="identifyDialog = false"
              />
            </v-dialog>
          </div>
        </div>
      </div>
    </v-img>
    <season-tabs v-if="item.Type === 'Series'" :item="item"></season-tabs>
    <related-items :id="$route.params.itemId" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { BaseItemDto } from '~/api';
import imageHelper from '~/mixins/imageHelper';
import timeUtils from '~/mixins/timeUtils';

interface MoreOptions {
  title: string;
  name: string;
}

export default Vue.extend({
  mixins: [imageHelper, timeUtils],
  data() {
    return {
      item: {} as BaseItemDto,
      backdropImageSource: '',
      moreOptions: [] as MoreOptions[],
      identifyDialog: false
    };
  },

  async beforeMount() {
    const Item = (
      await this.$itemsApi.getItems({
        uId: this.$auth.user.Id,
        userId: this.$auth.user.Id,
        ids: this.$route.params.itemId,
        fields: 'Overview,Genres'
      })
    ).data.Items as BaseItemDto[];

    this.item = Item[0];

    this.updateBackdropImage();

    this.getMoreOptions();
  },
  methods: {
    getAspectRatio() {
      return window.innerWidth / window.innerHeight;
    },
    /*
     * returns an array of options for the 'more' button
     */
    getMoreOptions() {
      if (this.$auth.user.Policy.IsAdministrator) {
        this.moreOptions.push({
          title: this.$t('identify').toString(),
          name: 'identify'
        });
      }
    },
    /*
     * Opens/closes the relevant dialog
     */
    openDialog(option: MoreOptions) {
      switch (option.name) {
        case 'identify':
          this.identifyDialog = true;
          break;
        default:
          break;
      }
    },
    getItemBackdrop(id: string): string {
      if (window.innerWidth < window.innerHeight) {
        return `${this.$axios.defaults.baseURL}/Items/${id}/Images/Primary`;
      } else {
        return `${this.$axios.defaults.baseURL}/Items/${id}/Images/Backdrop`;
      }
    },
    getEndsAtTime(ticks: number): string {
      const ms = this.ticksToMs(ticks);
      const endTimeLong = new Date(Date.now() + ms);
      // TODO: Respect user locale when rendering time
      const endTimeShort = endTimeLong.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric'
      });

      // TODO: Use a Date object
      return this.$t('endsAt', {
        time: endTimeShort
      }).toString();
    },
    ticksToTime(ticks: number) {
      const min = this.ticksToMs(ticks) / 60;
      if (Math.floor(min / 60) && Math.floor(min % 60)) {
        return `${Math.floor(min / 60)} hrs ${Math.floor(min % 60)} min`;
      } else if (Math.floor(min / 60)) {
        return `${Math.floor(min / 60)} hrs`;
      } else {
        return `${Math.floor(min % 60)} min`;
      }
    },
    renderItemSubHeading() {
      const response = [];
      if (this.item.ProductionYear) {
        response.push(this.item.ProductionYear);
      }
      if (this.item.Genres) {
        response.push(this.item.Genres[0]);
      }
      if (this.item.RunTimeTicks) {
        response.push(this.ticksToTime(this.item.RunTimeTicks));
      }
      if (this.item.RunTimeTicks) {
        response.push(this.getEndsAtTime(this.item.RunTimeTicks));
      }
      return response.join(' • ');
    },
    updateBackdropImage() {
      this.backdropImageSource = this.getItemBackdrop(this.item.Id || '');
    }
  }
});
</script>

<style scoped>
.item-container {
  margin: auto;
  max-width: calc(85vh * 16 / 9);
}

.backdrop-image {
  max-width: 95em;
  margin: auto;
}

.item-details-container {
  padding: 1em;
}

.gradient-container {
  background: linear-gradient(0deg, #0c0c0c, transparent);
  height: 30vh;
}

.item-sub-heading {
  font-size: 0.8rem;
  width: fit-content;
}

@media screen and (max-width: 30em) {
  .item-overview {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 90vw;
  }
}
</style>
