<template>
  <div ref="card" class="absolute">
    <transition-group mode="in-out" name="fade" class="absolute">
      <blurhash-canvas
        v-if="
          (imageType === 'Primary' &&
            item.ImageBlurHashes &&
            item.ImageBlurHashes.Primary &&
            item.ImageTags &&
            item.ImageTags.Primary) ||
          (imageType === 'Backdrop' &&
            item.ImageBlurHashes &&
            item.ImageBlurHashes.Backdrop &&
            item.ImageTags &&
            item.BackdropImageTags)
        "
        key="canvas"
        :hash="getImageHash"
        :width="width"
        :height="height"
        :punch="punch"
        class="absolute"
      />
      <img
        v-if="
          (imageType === 'Primary' &&
            item.ImageTags &&
            item.ImageTags.Primary) ||
          (imageType === 'Backdrop' && item.ImageTags && item.BackdropImageTags)
        "
        key="image"
        class="absolute"
        :src="image"
        v-bind="$attrs"
      />
    </transition-group>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { BaseItemDto, ImageType } from '~/api';
import imageHelper from '~/mixins/imageHelper';

export default Vue.extend({
  mixins: [imageHelper],
  props: {
    item: {
      type: Object as () => BaseItemDto,
      required: true
    },
    imageType: {
      type: String as () => ImageType.Primary,
      required: false,
      default: ImageType.Primary
    },
    width: {
      type: Number,
      default: 32
    },
    height: {
      type: Number,
      default: 32
    },
    punch: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      image: ''
    };
  },
  computed: {
    getImageHash(): string {
      if (
        this.imageType === ImageType.Backdrop &&
        this.item?.BackdropImageTags?.[0] &&
        this.item?.ImageBlurHashes?.Backdrop
      ) {
        return this.item?.ImageBlurHashes?.Backdrop?.[
          this.item?.BackdropImageTags?.[0]
        ];
      } else if (
        this.imageType === ImageType.Backdrop &&
        this.item?.ImageTags?.Thumb &&
        this.item.ImageBlurHashes?.Thumb?.[this.item?.ImageTags?.Thumb]
      ) {
        return this.item.ImageBlurHashes?.Thumb?.[this.item?.ImageTags?.Thumb];
      }
      if (
        this.item?.ImageTags?.Primary &&
        this.item.ImageBlurHashes?.Primary?.[this.item?.ImageTags?.Primary]
      )
        return this.item.ImageBlurHashes?.Primary?.[
          this.item?.ImageTags?.Primary
        ];
      // It should never reach this since there are v-ifs above that shouldn't call
      // getImagehash() if the relavent image tags are not there. But in the case that it does
      // This hash is here to prevent errors.
      return 'L7F$k?_*41GX^]KhTnJ8G?OXvz#;';
    }
  },
  mounted(): void {
    if (this.item.ImageTags && this.item.ImageTags.Primary) {
      const card = this.$refs.card as HTMLElement;
      this.image = this.getImageUrlForElement(card, this.item, this.imageType);
    }
  }
});
</script>

<style scoped>
.absolute {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
img {
  object-fit: cover;
}
</style>
