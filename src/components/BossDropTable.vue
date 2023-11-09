<template>
  <div class="table-container">
    <div class="table-title-wrapper">
      <div class="table-title">
        <span> {{ bossDifficulty }} {{ bossName }} </span>
        <span v-if="participants.length > 0">({{ participants.length }}인)</span>
        <span class="subtitle" v-if="perMoney > 0">인당 {{ addComma(perMoney) }} G</span>
        <button @click="onClickTargetBtn">✖️</button>
      </div>

      <div class="participants-wrapper">
        <div class="participants" v-for="(mem, index) in participantingMembers" :key="index">
          <input
            type="checkbox"
            class="dialog-participants"
            :value="mem.name"
            v-model="mem.participant"
          />
          <div>{{ mem.name }}</div>
        </div>
      </div>
    </div>

    <div class="table-contents">
      <table>
        <thead>
          <tr>
            <th>아이템</th>
            <th>개당 가격</th>
            <th>개수</th>
            <th>총액</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(dropItem, index) in dropItemList" :key="index">
            <td>{{ dropItem.label }}</td>
            <td>
              <input
                type="text"
                v-model="dropItem.price"
                oninput="this.value = this.value.replace(/(^0+)/, '').replace(/[^0-9]/g, '').replace(/\d(?=(?:\d{3})+$)/g, '$&,')"
                @input="sumMoney"
              />
              <span>{{ convertMoneyToKorean(dropItem.price) }}</span>
            </td>
            <td>
              <input
                type="number"
                v-model="dropItem.number"
                oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
                @input="sumMoney"
              />
            </td>
            <td>
              {{ calcMoney(dropItem.price, dropItem.number) }}
              <span>{{ convertMoneyToKorean(calcMoney(dropItem.price, dropItem.number)) }}</span>
            </td>
            <td @click="removeDropItem(index)">➖</td>
          </tr>
        </tbody>
      </table>
      <div class="table-tag">
        <table>
          <tbody>
            <tr>
              <td>총액</td>
              <td>{{ addComma(totalMoney) }}</td>
            </tr>
            <tr>
              <td>÷</td>
              <td>{{ participants.length }}</td>
            </tr>
            <tr>
              <td colspan="2">{{ addComma(perMoney) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-footer">
        <select v-model="newItemBuf">
          <option v-for="(drop, index) in bossDrops" :key="index" :value="index">
            {{ drop.label }}
          </option>
        </select>
        <button @click="onAddDropItem">추가하기</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bossName: String,
    bossDifficulty: String,
    bossDrops: Array,
    parentIndex: Number,
  },
  data() {
    return {
      dropItemList: [], // 우리 파티에서 드랍한 템
      participantingMembers: [
        { name: "보끈밤", participant: false },
        { name: "튀바밥", participant: false },
        { name: "폭풍쇠구", participant: false },
        { name: "지교과금강석", participant: false },
        { name: "기마듯", participant: false },
        { name: "건알집", participant: false },
        { name: "마조골드", participant: false },
        { name: "부기웅앵온", participant: false },
        { name: "덕질하려고옴", participant: false },
      ],
      participants: [],
      newItemBuf: 0,
      totalMoney: 0,
      perMoney: 0,
      totalAmountObject: {},
    };
  },
  methods: {
    onClickTargetBtn() {
      this.$parent.dropTable(this.parentIndex);
    },
    onAddDropItem() {
      const newItemIndex = this.newItemBuf;
      for (let item in this.dropItemList) {
        if (this.dropItemList[item].label === this.bossDrops[newItemIndex].label) {
          alert("이미 추가한 아이템입니다");
          return 0;
        }
      }

      const itemLabel = this.bossDrops[newItemIndex].label;
      const itemNumber = this.bossDrops[newItemIndex].number;
      const itemPrice = 0;

      const itemObject = {
        label: itemLabel,
        number: itemNumber,
        price: itemPrice,
      };
      this.dropItemList.push(itemObject);
    },
    removeDropItem(index) {
      this.dropItemList.splice(index, 1);
    },
    addComma(number) {
      return number
        .toString()
        .replace(/(^0+)/, "")
        .replace(/[^0-9]/g, "")
        .replace(/\d(?=(?:\d{3})+$)/g, "$&,");
    },
    convertMoneyToKorean(money) {
      let moneyNumber = Number(money.toString().split(",").join(""));
      let moneyKorean = "";

      if (Math.floor(moneyNumber / 100000000) > 0) {
        const share = Math.floor(moneyNumber / 100000000);
        const rest = moneyNumber % 100000000;

        moneyKorean = share.toString() + "억 ";
        moneyNumber = rest;

        const share2 = Math.floor(moneyNumber / 10000);
        const rest2 = moneyNumber % 10000;
        if (share2 > 0) {
          moneyKorean = moneyKorean + share2.toString() + "만 ";
        }
        moneyNumber = rest2;
        if (moneyNumber > 0) {
          moneyKorean = moneyKorean + moneyNumber.toString();
        }
      } else if (Math.floor(moneyNumber / 10000) > 0) {
        const share = Math.floor(moneyNumber / 10000);
        const rest = moneyNumber % 10000;

        moneyKorean = moneyKorean + share.toString() + "만 ";
        moneyNumber = rest;

        if (moneyNumber > 0) {
          moneyKorean = moneyKorean + moneyNumber.toString();
        }
      } else if (Number(moneyNumber) > 0) {
        moneyKorean = moneyKorean + moneyNumber.toString();
      }

      return moneyKorean;
    },
    calcMoney(money, number) {
      let moneyNumber = Number(money.toString().split(",").join(""));
      const buff = moneyNumber * number;
      return buff
        .toString()
        .replace(/(^0+)/, "")
        .replace(/[^0-9]/g, "")
        .replace(/\d(?=(?:\d{3})+$)/g, "$&,");
    },
    sumMoney() {
      this.totalMoney = 0;

      if (this.dropItemList.length > 0) {
        for (let dropItemIndex in this.dropItemList) {
          this.totalMoney +=
            this.dropItemList[dropItemIndex].number *
            Number(this.dropItemList[dropItemIndex].price.toString().split(",").join(""));
        }
      }

      this.getPerMoney();
    },
    getPerMoney() {
      const numberOfParticipants = this.participants.length;

      if (numberOfParticipants > 0) {
        this.perMoney = Math.floor(this.totalMoney / numberOfParticipants / 5000) * 5000;
      }
      this.setTotalAmountObject();
    },
    setTotalAmountObject() {
      this.totalAmountObject = {
        bossName: this.bossName,
        bossDifficulty: this.bossDifficulty,
        participants: this.participants,
        dropItemList: this.dropItemList,
        totalMoney: this.totalMoney,
        perMoney: this.perMoney,
      };
    },
    passTableForm() {
      return this.totalAmountObject;
    },
  },
  watch: {
    participantingMembers: {
      handler() {
        this.participants = [];
        this.perMoney = 0;

        for (const memberIndex in this.participantingMembers) {
          if (this.participantingMembers[memberIndex].participant) {
            this.participants.push(this.participantingMembers[memberIndex].name);
          }
        }

        this.getPerMoney();
      },
      deep: true,
    },
  },
  mounted() {
    this.newItemBuf = 0;
    this.onAddDropItem();
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/themes.scss";
@import "../styles/_variables.scss";

@each $theme in $themes {
  .#{map-get($theme, "name")} {
    .table-container {
      border-radius: 20px;
      margin-bottom: 30px;
      box-shadow: $content-box-shadow;
      position: relative;
      display: flex;
      flex-direction: column;

      &:hover {
        box-shadow: 1px 1px 5px 0 rgba(1, 1, 1, 0.3);
        transition: 0.2s;

        .table-title-wrapper .table-title button {
          display: block;
        }
      }

      .table-title-wrapper {
        padding: 20px 20px 10px 20px;
        border-radius: 20px 20px 0 0;
        background-color: map-get($map: $theme, $key: "background");
        position: relative;

        .table-title {
          padding-bottom: 2rem;
          position: relative;
          user-select: none;

          span {
            font-weight: bold;
            font-size: 2rem;
            font-family: "MaplestoryOTFBold";
          }

          .subtitle {
            font-size: 1.4rem;
            font-weight: normal;
            margin-left: 0.8rem;
            color: $main-color;
          }

          button {
            display: block;
            position: absolute;
            top: 0;
            right: 0;
            background-color: $error-msg;
            border: 3px solid $error-msg;
            color: $black;

            &:hover {
              border: 3px solid $error-msg;
              background-color: map-get($map: $theme, $key: "light-color");
              transition: 0.2s;
              scale: 1.1;
            }
          }
        }

        .participants-wrapper {
          display: flex;
          .participants {
            margin-right: 10px;
            position: relative;
            box-sizing: border-box;
            cursor: pointer;
            user-select: none;

            input[type="checkbox"] {
              position: absolute;
              opacity: 0;
              box-sizing: border-box;
              width: 100%;
              height: 100%;
              cursor: pointer;

              & ~ div {
                background-color: map-get($map: $theme, $key: "dark-color");
                color: rgba(map-get($map: $theme, $key: "text"), 0.7);
                padding: 7px 18px;
                box-sizing: border-box;
                font-size: 0.85rem;
                border-radius: 10px;
              }

              &:checked ~ div {
                background-color: $main-color;
                color: $black;
              }
            }
          }
        }
      }

      .table-contents {
        padding: 10px 30px 30px 30px;
        border-radius: 0 0 20px 20px;
        background-color: map-get($map: $theme, $key: "light-color");
        border: 3px solid map-get($map: $theme, $key: "background");
        display: flex;
        flex-direction: column;

        table {
          background: map-get($map: $theme, $key: "background");
          border: 1px solid map-get($map: $theme, $key: "dark-color");

          * {
            position: relative;
          }
          td,
          th {
            padding: 10px;
            text-align: center;
            border: 1px solid map-get($map: $theme, $key: "dark-color");
            box-sizing: border-box;
            vertical-align: middle;

            &:first-of-type {
              text-align: left;
              width: 250px;
            }

            &:nth-of-type(2) {
              width: 200px;

              input {
                margin-bottom: 20px;
              }
            }

            &:nth-of-type(3) {
              width: 100px;

              input {
                max-width: 40px;
              }
            }

            &:nth-of-type(4) {
              width: 200px;
              input {
                margin-bottom: 20px;
              }
            }

            &:last-of-type {
              width: 50px;
            }
          }

          thead tr {
            background: map-get($map: $theme, $key: "dark-color");
            font-weight: bold;
            th {
              border-right: 1px solid map-get($map: $theme, $key: "background");

              &:last-of-type {
                border: none;
              }
            }
          }

          tbody tr {
            &:hover {
              background: rgba(map-get($map: $theme, $key: "text"), 0.05);
            }
            td {
              font-weight: bold;
              input {
                background: map-get($map: $theme, $key: "light-color");
                color: map-get($map: $theme, $key: "text");
                font-size: 1.2rem;
                font-weight: bold;
                text-align: center;
                border: 3px solid map-get($map: $theme, $key: "light-color");

                &:focus {
                  border: 3px solid $main-color;
                  transition: 0.2s;
                }
              }
              span {
                position: absolute;
                bottom: 10px;
                left: 0;
                right: 0;
                color: rgba(map-get($map: $theme, $key: "text"), 0.7);
                font-size: 0.9rem;
                font-weight: normal;
              }

              &:last-of-type {
                cursor: pointer;
              }
              &:hover {
                background: rgba(map-get($map: $theme, $key: "text"), 0.05);

                &:last-of-type {
                  background: $error-msg;
                }
              }
            }
          }
        }

        .table-tag {
          position: relative;
          width: 100%;
          padding: 1rem;
          box-sizing: border-box;
          display: flex;
          justify-content: flex-end;

          table {
            background: transparent !important;
            font-size: 0.8rem;
            width: 300px;
            user-select: none;

            tr,
            td {
              text-align: end;
              border: none !important;
              &:hover {
                background: transparent !important;
                cursor: default !important;
              }

              &:first-child {
                width: 50px;
              }

              &:last-child {
                width: 150px;
              }
            }

            tr:last-child {
              border-top: 1px solid rgba(map-get($map: $theme, $key: "text"), 0.2) !important;
              padding: 10px;
            }
          }
        }

        .table-footer {
          box-sizing: border-box;
          width: 100%;
          padding: 10px;
          display: flex;
          justify-content: center;

          select {
            border: 3px solid map-get($map: $theme, $key: "background");
            background: map-get($map: $theme, $key: "background");
            color: map-get($map: $theme, $key: "text");
            width: 100%;
            max-width: 600px;
            font-size: 1.2rem;
            margin-right: 20px;

            &:hover {
              border: 3px solid $main-color;
            }
          }

          button {
            border: 3px solid $main-color;
            border-radius: 20px;
            background: map-get($map: $theme, $key: "background");
            color: map-get($map: $theme, $key: "text");

            &:hover {
              background: $main-color;
              transition: 0.2s;
            }
          }
        }
      }
    }
  }
}
</style>
