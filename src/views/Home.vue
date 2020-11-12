<template>
  <div class="home">
    <van-swipe
      style="height: 100vh"
      vertical
      @change="onChange"
      :show-indicators="false"
    >
      <van-swipe-item>
        <div class="main" v-if="isshow">
          <video-player
            v-if="playerOptions.sources[0].src"
            class="video-player vjs-custom-skin"
            ref="videoPlayer"
            :playsinline="true"
            :options="playerOptions"
          ></video-player>
          <div class="footbox">
            <div class="foot">
              <p class="user">@ {{ artistName }}</p>
              <p class="name">{{ name }}</p>
            </div>
            <div class="pl" @click="openPl">
              <van-icon name="chat" size="30" />
            </div>
          </div>
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div class="main" v-if="!isshow">
          <video-player
            v-if="playerOptions.sources[0].src"
            class="video-player vjs-custom-skin"
            ref="videoPlayer"
            :playsinline="true"
            :options="playerOptions"
          ></video-player>
          <div class="footbox">
            <div class="foot">
              <p class="user">@ {{ artistName }}</p>
              <p class="name">{{ name }}</p>
            </div>
            <div class="pl" @click="openPl">
              <van-icon name="chat" size="30" />
            </div>
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>
    <van-action-sheet v-model="show" class="sheet">
      <van-list
        v-model="loading"
        @load="onLoad"
        :offset="1"
        :immediate-check="false"
      >
        <div v-for="(item, index) in plist" :key="index" class="ovf pll">
          <div class="pl-l"><img :src="item.user.avatarUrl" alt="" /></div>
          <div class="pl-r">
            <div class="name1">{{ item.user.nickname }}</div>
            <div class="con">{{ item.content }}</div>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>
</template>

<script>
import { list, mv, pl } from "@request/api";
import "../video/index";
import { videoPlayer } from "vue-video-player";
export default {
  name: "home",
  data() {
    return {
      list: "",
      src: "",
      id: "",
      show: false,
      dataLength: 1,
      artistName: "",
      name: "",
      isshow: true,
      plist: "",
      loading: false,
      finished: false,
      page: 10,
      playerOptions: {
        autoplay: true, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{ type: "video/mp4", src: "" }],
        width: document.documentElement.clientWidth,
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 分时
          durationDisplay: true, // 持续时间显示
          remainingTimeDisplay: false, // 剩余时间显示
        },
      },
    };
  },
  components: {
    videoPlayer,
  },
  created() {
    this.wait();
  },
  methods: {
    async wait() {
      let id = await this.get();
      let res = await mv(id);
      // this.src = res.data.url;
      this.$set(this.playerOptions.sources[0], "src", res.data.url);
    },
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        this.page += 10;
        this.getpl();
        this.loading = false;
      }, 500);
    },
    get() {
      return list(this.dataLength).then((res) => {
        this.id = res.data[this.dataLength - 1].id;
        this.artistName = res.data[this.dataLength - 1].artistName;
        this.name = res.data[this.dataLength - 1].name;
        return this.id;
        // return Promise.resolve(this.id);
        // 等价于
        // return new Promise((resolve) => {
        //   resolve(this.id)
        // })
      });
    },
    getpl() {
      pl(this.id, this.page).then((res) => {
        if (document.querySelector(".van-action-sheet__content")) {
          document.querySelector(".van-action-sheet__content").scrollTop = 0;
        }
        this.plist = res.comments;
      });
    },
    onChange() {
      this.isshow = !this.isshow;
      this.dataLength += 1;
      this.page = 10;
      this.wait();
      this.getpl();
    },
    openPl() {
      this.show = true;
      this.getpl();
    },
  },
};
</script>
<style lang="less" scoped>
.main {
  height: 100%;
}
.footbox {
  position: relative;
  bottom: 0;
  width: 95%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.user,
.name {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.foot {
  width: 80%;
  color: #fff;
  font-size: 16px;
  z-index: 10001;
}
.pl {
  width: 10%;
  color: #fff;
  font-size: 16px;
  z-index: 10001;
}
.sheet {
  height: 50vh;
  .pll {
    overflow: hidden;
    padding: 10px;
    border-bottom: 1px solid #f4f4f4;
    .pl-l {
      width: 20%;
      float: left;
    }
    .pl-l img {
      width: 55%;
      border-radius: 50%;
      animation: all ds 0.5s;
    }
    @keyframes ds {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    .pl-r {
      width: 78%;
      float: left;
    }
    .name1 {
      font-size: 14px;
      color: #666;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .con {
      width: 100%;
      line-height: 24px;
      color: #333333;
      font-size: 14px;
    }
  }
}
</style>
