<template>
  <div class="HomeIndex">
    <div class="wrapper">
      <div class="title">{{ title }}</div>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-card class="box-card">
            <div class="subTitle">
              <el-tag>Input Model</el-tag>
            </div>
            <el-divider></el-divider>
            <el-form v-model="postForm" ref="postForm" :rules="postRules" label-width="100px">
              <el-form-item v-for="item in formList" :key="item.index" :label="item.label" :prop="item.prop">
                <el-input type="number" v-model="postForm[item.prop]"></el-input>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <div class="subTitle">
              <el-tag type="success">Output Model</el-tag>
            </div>
            <el-divider></el-divider>
            <div>
              <div class="item">
                设备状态: &nbsp;&nbsp;<el-tag type="success" effect="dark">{{deviceStateValue}}</el-tag> 
                 &nbsp;&nbsp;{{ deviceStateValue !== 0 ? '( ' + deviceStateValueAccurate + ')' : ''}}
              </div>
              <div class="colorBar">
                <div>
                  <span class="tip" v-for="(item, index) in deviceState" :key="index">
                    {{ deviceStateValue === index - '0' ? item : ' '}}
                  </span>
                </div>
                <div>
                  <span :class="'c' + index" v-for="(item, index) in deviceState" :key="item.index">
                  </span>
                </div>
              </div>
              <el-divider></el-divider>
              <div class="item label">故障类型： {{wrongType['type']}} &nbsp;
                {{powerErrorType.flag ? powerErrorType.type : ''}} &nbsp;
                {{pressureErrorType.flag > 0 ? pressureErrorType.error[pressureErrorType.flag].type : ''}}
              </div>
              <el-card class="box-card" shadow="hover">
                {{wrongType['description']}}
              </el-card>
              <el-card v-if="powerErrorType.flag" class="box-card" shadow="hover">
                {{ powerErrorType.description }}
              </el-card>
              <el-card v-if="pressureErrorType.flag > 0" class="box-card" shadow="hover">
                {{ pressureErrorType.error[pressureErrorType.flag].description }}
              </el-card>
              <el-divider></el-divider>
              <el-button type="success" @click="handleCalculate('postForm')">
                进行评估
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="Matlab 环境初始化"
      :visible.sync="loadingDialogVisible"
      width="80%">
      <h2 style="text-align:center">Matlab 环境加载中，请稍等...</h2>
      <p style="text-align:center">
        <i class="el-icon-loading" style="padding: 20px; font-size:30px"></i>
      </p>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'HomePage',
    computed: {
      estimateType () {
        return [
          {
            type: '默认正常',
            description: '默认描述'
          },
          {
            type: '低温过热（低于150）',
            description: '纸包绝缘导线过热，注意 CO 和 C02 的增量和 CO2/C0 的值'
          },
          {
            type: '低温过热（150 ~ 300）',
            description: '分接开关接触不良；引线连接不良；导线接头焊接不良，股间短路引起过热；铁心多点接地，矽钢片间局部短路等'
          },
          {
            type: '中温过热（300 ~ 700）',
            description: '分接开关接触不良；引线连接不良；导线接头焊接不良，股间短路引起过热；铁心多点接地，矽钢片间局部短路等'
          },
          {
            type: '高温过热（高于700）',
            description: '分接开关接触不良；引线连接不良；导线接头焊接不良，股间短路引起过热；铁心多点接地，矽钢片间局部短路等'
          },
          {
            type: '局部放电',
            description: '高温、气隙、毛刺、漆瘤、杂质等所引起的低能量密度的放电'
          },
          {
            type: '低能放电',
            description: '不同电位之间的火花放电，引线与穿缆套管（或引线屏蔽管）之间的环流'
          },
          {
            type: '低能放电兼过热',
            description: '不同电位之间的火花放电，引线与穿缆套管（或引线屏蔽管）之间的环流'
          },
          {
            type: '电弧放电',
            description: '线圈匝间、层间放电、相间闪络；分接引线间油隙闪络，选择开关拉弧；引线对箱壳或其他接地体放电'
          },
          {
            type: '电弧放电兼过热',
            description: '线圈匝间、层间放电、相间闪络；分接引线间油隙闪络，选择开关拉弧；引线对箱壳或其他接地体放电'
          }
        ]
      },
      estimateMap () {
        return {
          0: {
            0: {
              0: this.estimateType[1],
              2: this.estimateType[4]
            },
            2: {
              0: this.estimateType[2],
              1: this.estimateType[3],
              2: this.estimateType[4]
            },
            1: {
              0: this.estimateType[5],
              2: this.estimateType[4]
            }
          },
          2: {
            0: {
              0: this.estimateType[6],
              1: this.estimateType[6],
              2: this.estimateType[6]
            },
            1: {
              0: this.estimateType[6],
              1: this.estimateType[6],
              2: this.estimateType[6]
            },
            2: {
              0: this.estimateType[7],
              1: this.estimateType[7],
              2: this.estimateType[7]
            }
          },
          1: {
            0: {
              0: this.estimateType[8],
              1: this.estimateType[8],
              2: this.estimateType[8]
            },
            1: {
              0: this.estimateType[8],
              1: this.estimateType[8],
              2: this.estimateType[8]
            },
            2: {
              0: this.estimateType[9],
              1: this.estimateType[9],
              2: this.estimateType[9]
            }
          }
        }
      }
    },
    data () {
      return {
        title: '倒置式油浸电流互感器多参数状态评估与故障防治系统',
        loadingDialogVisible: false,
        matlabFlag: false,
        formList: [
          {
            label: 'H2',
            prop: 'h2'
          },
          {
            label: 'CH4',
            prop: 'ch4'
          },
          {
            label: 'C2H6',
            prop: 'c2h6'
          },
          {
            label: 'C2H4',
            prop: 'c2h4'
          },
          {
            label: 'C2H2',
            prop: 'c2h2'
          },
          {
            label: 'CO',
            prop: 'co'
          },
          {
            label: 'CO2',
            prop: 'co2'
          },
          {
            label: '压力',
            prop: 'pressure'
          },
          {
            label: '局部放电量',
            prop: 'power'
          }
        ],
        postForm: {
          h2: 200,
          ch4: 60,
          c2h6: 50,
          c2h4: 50,
          c2h2: 10,
          co: 1644,
          co2: 2617,
          pressure: 170000,
          power: 0
        },
        postRules: {},
        deviceState: {
          1: '正常',
          2: '注意',
          3: '异常',
          4: '严重状态'
        },
        deviceStateValue: 0,
        deviceStateValueAccurate: 0,
        wrongType: {
          type: '',
          description: ''
        },
        powerErrorType: {
          // false: 局部放电量正常，true: 局部放电量异常
          flag: false,
          type: '局部放电',
          description: '高温、气隙、毛刺、漆瘤、杂质等所引起的低能量密度的放电'
        },
        pressureErrorType: {
          flag: 0, // 0: 压力正常， 1: 压力漏油异常，2: 压力内部放电异常
          error: [
            {
              type: '',
              description: ''
            },
            {
              type: '漏油报警',
              description: '漏油报警漏油报警漏油报警'
            },
            {
              type: '内部放电报警',
              description: '内部放电报警内部放电报警内部放电报警'
            }
          ]
        }
      }
    },
    created () {
      this.loadingDialogVisible = true
      // 监听计算结果
      this.$electron.ipcRenderer.on('getInitRes', (e, info) => {
        this.$electron.ipcRenderer.send('state')
        setTimeout(() => {
          if (this.matlabFlag) {
            this.loadingDialogVisible = false
            this.$notify.success('Matlab 环境加载成功')
          } else {
            this.loadingDialogVisible = false
            this.$notify.error('Matlab 环境加载失败!')
          }
        }, 2000)
      })
      // 监听计算结果
      this.$electron.ipcRenderer.on('getCalculateRes', (e, info) => {
        this.$electron.ipcRenderer.send('state')
        this.deviceStateValueAccurate = Math.round(info * 1000) / 1000
        this.deviceStateValue = Math.round(info) // 四舍五入
        this.handleEstimate()
        this.$notify.success('评估成功，评估值为： ' + this.deviceStateValueAccurate)
      })
      // 监听计算结果
      this.$electron.ipcRenderer.on('getStateRes', (e, info) => {
        this.matlabFlag = info
      })
      this.$electron.ipcRenderer.send('init')
    },
    methods: {
      handleCalculate (form) {
        if (!this.matlabFlag) {
          this.$notify.error('Matlab 环境加载失败!')
          return
        }
        let temp = ''
        for (let item in this.postForm) {
          if (this.postForm[item] === null) {
            temp += '0,'
          } else {
            temp += this.postForm[item]
            temp += ','
          }
        }
        let input = (temp.substring(temp.length - 1) === ',') ? temp.substring(0, temp.length - 1) : temp
        console.log(input)
        this.$electron.ipcRenderer.send('calculate', input)
        // this.$electron.shell.openExternal(link)
      },
      handleEstimate () {
        // a = C2H2/C2H4, b = CH4/H2, c = C2H4/C2H6
        let a = this.postForm.c2h2 / this.postForm.c2h4
        let b = this.postForm.ch4 / this.postForm.h2
        let c = this.postForm.c2h4 / this.postForm.c2h6
        if (a < 0.1) {
          a = 0
        } else if (a < 3) {
          a = 1
        } else {
          a = 2
        }
        if (b < 0.1) {
          b = 1
        } else if (b < 1) {
          b = 0
        } else {
          b = 2
        }
        if (c < 1) {
          c = 0
        } else if (c < 3) {
          c = 1
        } else {
          c = 2
        }
        console.log(a, ' ', b, ' ', c)
        console.log(this.estimateMap[a][b][c])
        this.wrongType = this.estimateMap[a][b][c]
        // 局部放电量判据 + 压力判据
        if (this.postForm.power > 20) {
          this.powerErrorType.flag = true
          // 如果 deviceStateValue < 3（异常），仍显示异常
          if (this.deviceStateValue < 3) {
            this.deviceStateValue = 3
          }
        } else {
          this.powerErrorType.flag = false
        }
        if (this.postForm.pressure < 169925) {
          // 漏油报警
          this.pressureErrorType.flag = 1
          // 如果 deviceStateValue < 3（异常），仍显示异常
          if (this.deviceStateValue < 3) {
            this.deviceStateValue = 3
          }
        } else if (this.postForm.pressure > 177425) {
          // 内部放电报警
          this.pressureErrorType.flag = 2
          // 如果 deviceStateValue < 3（异常），仍显示异常
          if (this.deviceStateValue < 3) {
            this.deviceStateValue = 3
          }
        } else {
          this.pressureErrorType.flag = 0
        }
      }
    }
  }
</script>

<style lang="scss">
  .HomeIndex{
    height: 100%;
    width: 100%;
    .wrapper{
      height: 100%;
      max-width: 1000px;
      margin: auto;
    }
    .title{
      height: 100px;
      line-height: 100px;
      text-align: center;
      font-size: 24px !important;
      font-weight: bolder;
    }
    .subTitle{
      text-align: center;
      height: 20px;
      line-height: 20px;
      .el-tag{
        font-size: 16px!important;
      }
    }
    .el-card{
      margin: 5px 0;
      height:fit-content;
      color:#333;
    }
    .el-row{
      height: calc(100% - 150px) !important;
    }
    .el-col{
      height: 100% !important;
    }
    .el-form-item{
      margin: 12px!important;
    }
    .el-input{
      width: 200px;
    }
    .item{
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: bolder
    }
    .label{
      margin-bottom: 15px
    }
    .colorBar{
      margin: 0;
      span{
        margin-top: 5px;
        display: inline-block;
        width: 80px!important;
        height: 18px;
      }
      .c1{
        background: darkblue;
      }
      .c2{
        background: aqua;
      }
      .c3{
        background: coral;
      }
      .c4{
        background: brown;
      }
      .tip{
        padding: 0 0 10px 0;
        text-align: center;
      }
    }
  }
</style>