<template>
  <div class="home">
    <van-swipe style="height: 100vh;" vertical @change="onChange" :show-indicators="false">
      <van-swipe-item >
        <div class="main" v-if="isshow===true">
          <video  loop
                  ref="video1"
                  style="width:100%;height:100vh;object-fit:contain"
                  :src="src"
                  :poster='poster'
                  webkit-playsinline="true"
                  x5-playsinline=""
                  x5-video-player-type="h5"
                  x5-video-player-fullscreen="true"
                  playsinline="true"
                  preload="auto"
                  autoplay
                  x-webkit-airplay="allow"
                  x5-video-orientation="portrait"
          >
          </video>
          <div class="foot">
            <p class="user">@ {{artistName}}</p>
            <p class="name">{{name}}</p>
          </div>
          <div class="pl" @click="openPl">
            <van-icon name="chat" size="30"/>
          </div>
        </div>
      </van-swipe-item>
      <van-swipe-item >
        <div class="main" v-if="isshow===false">
          <video  loop
                  ref="video1"
                  style="width:100%;height:100vh;object-fit:contain"
                  :src="src"
                  :poster='poster'
                  webkit-playsinline="true"
                  x5-playsinline=""
                  x5-video-player-type="h5"
                  x5-video-player-fullscreen="true"
                  playsinline="true"
                  preload="auto"
                  autoplay
                  x-webkit-airplay="allow"
                  x5-video-orientation="portrait"
          >
          </video>
          <div class="foot">
            <p class="user">@ {{artistName}}</p>
            <p class="name">{{name}}</p>
          </div>
          <div class="pl"  @click="openPl">
            <van-icon name="chat" size="30"/>
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>
    <van-action-sheet v-model="show" class="sheet">
      <van-list
              v-model="loading"
              @load="onLoad"
              :offset = '1'
              :immediate-check="false"
      >
        <div v-for="(item,index) in plist" :key='index' class="ovf pll">
          <div class="pl-l"><img :src="item.user.avatarUrl" alt=""></div>
          <div class="pl-r">
            <div class="name1">{{item.user.nickname}}</div>
            <div class="con">{{item.content}}</div>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>
</template>

<script>
import  {list, mv, pl} from '@request/api'
export default {
  name: 'home',
  data () {
    return {
      list: '',
      src: '',
      id:'',
      show: false,
      poster:'',
      dataLength:53,
      artistName: '',
      name: '',
      isshow:true,
      plist:'',
      loading: false,
      finished: false,
      page:10
    }
  },
  components: {},
  // created(){
  //   this.get().then(id=>mv(id)).then(res=>{
  //     this.src=res.data.url
  //   })
  // },
  created () {
    this.wait()
  },
  methods:{
    async wait () {
      let id = await this.get()
      let res = await mv(id)
      this.src=res.data.url
    },
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        this.page+=10
        this.getpl()
        this.loading = false
      }, 500);
    },
    get () {
        return list(this.dataLength).then(res => {
                // success
                let randomNum = Math.floor(Math.random()*res.data.length)
                this.id = res.data[randomNum].id
                this.poster = res.data[randomNum].cover
                this.artistName=res.data[randomNum].artistName
                this.name=res.data[randomNum].name
                return this.id
                // return Promise.resolve(this.id);
                // 等价于
                // return new Promise((resolve) => {
                //   resolve(this.id)
                // })
              })
    },
    getpl () {
      pl(this.id,this.page).then((res) => {
        // success
        console.log(res)
        this.plist = res.comments
      })
    },
    onChange () {
      this.isshow=!this.isshow
      this.page=10
      this.wait()
      this.getpl()
    },
    openPl() {
      this.show = true
      this.getpl()
    }
  }
}
</script>
<style lang="less" scoped>
  .foot{
    position: fixed;
    bottom:5vh;
    left:5vw;
    color: #fff;
    font-size: 16px;
    z-index: 10001;
  }
  .pl{
    position: fixed;
    bottom:20vh;
    right:5vw;
    color: #fff;
    font-size: 16px;
    z-index: 10001;
  }
  .sheet{
    height: 50vh;
    .pll{
      overflow: hidden;
      padding: 10px;
      border-bottom: 1px solid #f4f4f4;
      .pl-l{width: 20%;float: left;}
      .pl-l img{width: 55%;border-radius: 50%;}
      .pl-r{width: 78%;float: left;}
      .name1{font-size:14px;color: #666;font-weight: bold;margin-bottom: 5px;}
      .con{width: 100%;line-height: 24px;color: #333333;font-size:14px;}
    }
  }

</style>
